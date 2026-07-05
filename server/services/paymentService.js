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
 * Handles Stripe payments and credit purchases.
 */
class PaymentService {
  /**
   * Create a Stripe payment intent
   */
  async createPaymentIntent(userId, packageId) {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
    }

    const pkg = await creditService.getPackageById(packageId);
    if (!pkg) throw new Error('Invalid package');

    const userResult = await db.query('SELECT email, name FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) throw new Error('User not found');
    const user = userResult.rows[0];

    const paymentResult = await db.query(`
      INSERT INTO payments (user_id, package_id, amount, currency, payment_method, status)
      VALUES ($1, $2, $3, 'usd', 'STRIPE', 'PENDING') RETURNING id
    `, [userId, packageId, pkg.price]);

    const paymentId = paymentResult.rows[0].id;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(pkg.price * 100),
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

      await db.query('UPDATE payments SET payment_intent_id = $1 WHERE id = $2', [paymentIntent.id, paymentId]);

      return {
        paymentId,
        clientSecret: paymentIntent.client_secret,
        amount: pkg.price,
        credits: pkg.credits,
        bonusCredits: pkg.bonus_credits,
        totalCredits: pkg.credits + pkg.bonus_credits
      };
    } catch (error) {
      await db.query('UPDATE payments SET status = $1 WHERE id = $2', ['FAILED', paymentId]);
      throw error;
    }
  }

  /**
   * Confirm payment and credit user account.
   *
   * 1.3 FIX: This method now verifies the PaymentIntent status directly with
   * Stripe before crediting any account. Client-supplied data is never trusted.
   * It also uses SELECT FOR UPDATE on the payments row so a webhook delivery
   * and a /confirm call racing each other cannot both credit the same payment.
   */
  async confirmPayment(paymentIntentId) {
    if (!stripe) {
      throw new Error('Stripe is not configured.');
    }

    // ── Step 1: Verify with Stripe that the payment actually succeeded ────────
    let stripePaymentIntent;
    try {
      stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (err) {
      throw new Error(`Could not retrieve PaymentIntent from Stripe: ${err.message}`);
    }

    if (stripePaymentIntent.status !== 'succeeded') {
      return {
        success: false,
        verified: false,
        stripeStatus: stripePaymentIntent.status,
        message: `Payment has not succeeded. Current Stripe status: ${stripePaymentIntent.status}`
      };
    }

    // ── Step 2: Atomically claim the payment row ──────────────────────────────
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Lock the payments row so concurrent calls cannot both credit
      const paymentResult = await client.query(`
        SELECT p.*, cp.credits, cp.bonus_credits, cp.name as package_name
        FROM payments p
        JOIN credit_packages cp ON p.package_id = cp.id
        WHERE p.payment_intent_id = $1
        FOR UPDATE
      `, [paymentIntentId]);

      if (paymentResult.rows.length === 0) throw new Error('Payment not found');

      const payment = paymentResult.rows[0];

      if (payment.status === 'COMPLETED') {
        await client.query('ROLLBACK');
        return { alreadyProcessed: true, payment };
      }

      const totalCredits = payment.credits + payment.bonus_credits;

      const transaction = await creditService.creditCredits(
        payment.user_id,
        totalCredits,
        'PURCHASE',
        `Purchased ${payment.package_name} package (${payment.credits} + ${payment.bonus_credits} bonus credits)`,
        payment.id
      );

      await client.query(
        'UPDATE payments SET status = $1, completed_at = CURRENT_TIMESTAMP, transaction_id = $2 WHERE id = $3',
        ['COMPLETED', transaction.transactionId, payment.id]
      );

      await client.query('COMMIT');

      console.log(JSON.stringify({
        event: 'PAYMENT_CONFIRMED',
        userId: payment.user_id,
        paymentId: payment.id,
        paymentIntentId,
        creditsGranted: totalCredits,
        transactionId: transaction.transactionId
      }));

      return {
        success: true,
        verified: true,
        payment: { ...payment, status: 'COMPLETED' },
        transaction,
        totalCredits
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Handle Stripe webhook events.
   * Uses the Stripe event ID for idempotency — a webhook replayed twice
   * will credit the account only once.
   */
  async handleWebhook(event) {
    console.log(JSON.stringify({ event: 'WEBHOOK_RECEIVED', type: event.type, id: event.id }));

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object, event.id);
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

  async handlePaymentSuccess(paymentIntent, stripeEventId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Idempotency guard: if this Stripe event has already been processed, skip
      if (stripeEventId) {
        const existing = await client.query(
          'SELECT id FROM payments WHERE stripe_event_id = $1',
          [stripeEventId]
        );
        if (existing.rows.length > 0) {
          await client.query('ROLLBACK');
          console.log(JSON.stringify({ event: 'WEBHOOK_DUPLICATE_SKIPPED', stripeEventId }));
          return { alreadyProcessed: true };
        }
      }

      // Mark the event ID before crediting to prevent race conditions
      await client.query(
        'UPDATE payments SET stripe_event_id = $1 WHERE payment_intent_id = $2 AND stripe_event_id IS NULL',
        [stripeEventId, paymentIntent.id]
      );

      await client.query('COMMIT');

      // Now do the actual credit (it has its own transaction with FOR UPDATE)
      const result = await this.confirmPayment(paymentIntent.id);
      console.log(JSON.stringify({ event: 'PAYMENT_SUCCESS_WEBHOOK', paymentIntentId: paymentIntent.id }));
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error in handlePaymentSuccess:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async handlePaymentFailure(paymentIntent) {
    try {
      await db.query('UPDATE payments SET status = $1 WHERE payment_intent_id = $2', ['FAILED', paymentIntent.id]);
      console.log(JSON.stringify({ event: 'PAYMENT_FAILED', paymentIntentId: paymentIntent.id }));
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  async handleRefund(charge) {
    try {
      const paymentIntentId = charge.payment_intent;

      const paymentResult = await db.query('SELECT * FROM payments WHERE payment_intent_id = $1', [paymentIntentId]);
      if (paymentResult.rows.length === 0) {
        console.log('Payment not found for refund, skipping');
        return;
      }
      const payment = paymentResult.rows[0];

      if (payment.status !== 'COMPLETED') {
        console.log('Payment not completed, skipping refund');
        return;
      }

      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        await client.query('UPDATE payments SET status = $1 WHERE id = $2', ['REFUNDED', payment.id]);

        const transactionResult = await client.query('SELECT * FROM transactions WHERE payment_id = $1', [payment.id]);

        if (transactionResult.rows.length > 0) {
          const pkg = await creditService.getPackageById(payment.package_id);
          const totalCredits = pkg.credits + pkg.bonus_credits;

          await creditService.debitCredits(
            payment.user_id,
            totalCredits,
            `Refund processed for payment #${payment.id}`
          );
        }

        await client.query('COMMIT');
        console.log(JSON.stringify({ event: 'REFUND_PROCESSED', paymentId: payment.id, paymentIntentId }));
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error handling refund:', error);
    }
  }

  constructWebhookEvent(payload, signature) {
    if (!stripe) throw new Error('Stripe is not configured');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('⚠️  Webhook signature verification failed:', error.message);
      throw new Error('Webhook signature verification failed');
    }
  }

  async getPaymentHistory(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    const paymentsResult = await db.query(`
      SELECT p.*, cp.name as package_name, cp.credits, cp.bonus_credits
      FROM payments p
      JOIN credit_packages cp ON p.package_id = cp.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    const countResult = await db.query('SELECT COUNT(*) as total FROM payments WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].total, 10);

    return {
      payments: paymentsResult.rows,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    };
  }

  async getPaymentById(paymentId, userId = null) {
    let query = `
      SELECT p.*, cp.name as package_name, cp.credits, cp.bonus_credits
      FROM payments p
      JOIN credit_packages cp ON p.package_id = cp.id
      WHERE p.id = $1
    `;
    const params = [paymentId];
    if (userId) {
      query += ' AND p.user_id = $2';
      params.push(userId);
    }
    const paymentResult = await db.query(query, params);
    return paymentResult.rows[0];
  }
}

module.exports = new PaymentService();
