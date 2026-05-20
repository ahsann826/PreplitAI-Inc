const Stripe = require('stripe');
const db = require('../db/database');
const creditService = require('./creditService');

// Initialize Stripe (will be null if key not provided)
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.warn('⚠️  Stripe not initialized:', error.message);
}

/**
 * Payment Service
 * Handles Stripe payments and credit purchases
 */
class PaymentService {
  /**
   * Create a Stripe payment intent
   */
  async createPaymentIntent(userId, packageId) {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
    }

    // Get package details
    const pkg = creditService.getPackageById(packageId);
    if (!pkg) {
      throw new Error('Invalid package');
    }

    // Get user details
    const user = db.prepare('SELECT email, name FROM users WHERE id = ?').get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create payment record
    const paymentResult = db.prepare(`
      INSERT INTO payments (user_id, package_id, amount, currency, payment_method, status)
      VALUES (?, ?, ?, 'usd', 'STRIPE', 'PENDING')
    `).run(userId, packageId, pkg.price);

    const paymentId = paymentResult.lastInsertRowid;

    try {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(pkg.price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId: userId.toString(),
          packageId: packageId.toString(),
          paymentId: paymentId.toString(),
          credits: pkg.credits.toString(),
          bonusCredits: pkg.bonus_credits.toString()
        },
        description: `${pkg.name} Package - ${pkg.credits} credits`,
        receipt_email: user.email
      });

      // Update payment record with payment intent ID
      db.prepare('UPDATE payments SET payment_intent_id = ? WHERE id = ?')
        .run(paymentIntent.id, paymentId);

      return {
        paymentId,
        clientSecret: paymentIntent.client_secret,
        amount: pkg.price,
        credits: pkg.credits,
        bonusCredits: pkg.bonus_credits,
        totalCredits: pkg.credits + pkg.bonus_credits
      };
    } catch (error) {
      // Mark payment as failed
      db.prepare('UPDATE payments SET status = ? WHERE id = ?')
        .run('FAILED', paymentId);
      
      throw error;
    }
  }

  /**
   * Confirm payment and credit user account
   * This is called after successful payment or via webhook
   */
  async confirmPayment(paymentIntentId) {
    return db.transaction(() => {
      // Get payment record
      const payment = db.prepare(`
        SELECT p.*, cp.credits, cp.bonus_credits, cp.name as package_name
        FROM payments p
        JOIN credit_packages cp ON p.package_id = cp.id
        WHERE p.payment_intent_id = ?
      `).get(paymentIntentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status === 'COMPLETED') {
        // Already processed
        return { alreadyProcessed: true, payment };
      }

      // Calculate total credits (base + bonus)
      const totalCredits = payment.credits + payment.bonus_credits;

      // Credit the user account
      const transaction = creditService.creditCredits(
        payment.user_id,
        totalCredits,
        'PURCHASE',
        `Purchased ${payment.package_name} package (${payment.credits} + ${payment.bonus_credits} bonus credits)`,
        payment.id
      );

      // Update payment status
      db.prepare('UPDATE payments SET status = ?, completed_at = CURRENT_TIMESTAMP, transaction_id = ? WHERE id = ?')
        .run('COMPLETED', transaction.transactionId, payment.id);

      return {
        success: true,
        payment: {
          ...payment,
          status: 'COMPLETED'
        },
        transaction,
        totalCredits
      };
    })();
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(event) {
    console.log('📨 Webhook received:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
      
      case 'charge.refunded':
        await this.handleRefund(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(paymentIntent) {
    try {
      const result = await this.confirmPayment(paymentIntent.id);
      console.log('✅ Payment confirmed:', paymentIntent.id);
      
      // TODO: Send email notification
      return result;
    } catch (error) {
      console.error('❌ Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailure(paymentIntent) {
    try {
      db.prepare('UPDATE payments SET status = ? WHERE payment_intent_id = ?')
        .run('FAILED', paymentIntent.id);
      
      console.log('❌ Payment failed:', paymentIntent.id);
      
      // TODO: Send email notification
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  /**
   * Handle refund
   */
  async handleRefund(charge) {
    try {
      const paymentIntent = charge.payment_intent;
      
      // Find the payment
      const payment = db.prepare('SELECT * FROM payments WHERE payment_intent_id = ?')
        .get(paymentIntent);
      
      if (!payment || payment.status !== 'COMPLETED') {
        console.log('Payment not found or not completed, skipping refund');
        return;
      }

      db.transaction(() => {
        // Update payment status
        db.prepare('UPDATE payments SET status = ? WHERE id = ?')
          .run('REFUNDED', payment.id);

        // Get the original transaction
        const transaction = db.prepare('SELECT * FROM transactions WHERE payment_id = ?')
          .get(payment.id);

        if (transaction) {
          // Debit the credits back
          const pkg = creditService.getPackageById(payment.package_id);
          const totalCredits = pkg.credits + pkg.bonus_credits;
          
          creditService.debitCredits(
            payment.user_id,
            totalCredits,
            `Refund for payment #${payment.id}`
          );
        }
      })();

      console.log('💰 Refund processed:', paymentIntent);
      
      // TODO: Send email notification
    } catch (error) {
      console.error('Error handling refund:', error);
    }
  }

  /**
   * Construct webhook event from raw body
   * This validates the webhook signature
   */
  constructWebhookEvent(payload, signature) {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('⚠️  Webhook signature verification failed:', error.message);
      throw new Error('Webhook signature verification failed');
    }
  }

  /**
   * Get payment history for user
   */
  getPaymentHistory(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const payments = db.prepare(`
      SELECT p.*, cp.name as package_name, cp.credits, cp.bonus_credits
      FROM payments p
      JOIN credit_packages cp ON p.package_id = cp.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset);

    const { total } = db.prepare('SELECT COUNT(*) as total FROM payments WHERE user_id = ?')
      .get(userId);

    return {
      payments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  /**
   * Get payment by ID
   */
  getPaymentById(paymentId, userId = null) {
    let query = `
      SELECT p.*, cp.name as package_name, cp.credits, cp.bonus_credits
      FROM payments p
      JOIN credit_packages cp ON p.package_id = cp.id
      WHERE p.id = ?
    `;
    const params = [paymentId];

    if (userId) {
      query += ' AND p.user_id = ?';
      params.push(userId);
    }

    const payment = db.prepare(query).get(...params);
    return payment;
  }
}

module.exports = new PaymentService();
