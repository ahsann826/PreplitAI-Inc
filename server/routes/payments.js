const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const authMiddleware = require('../middleware/auth');

/**
 * POST /api/payments/create-intent
 */
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({
        error: 'Missing package ID',
        message: 'Package ID is required'
      });
    }

    const result = await paymentService.createPaymentIntent(req.userId, packageId);

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      message: error.message
    });
  }
});

/**
 * POST /api/payments/confirm
 * Confirm payment after successful Stripe payment.
 *
 * 1.3 FIX: This endpoint now calls stripe.paymentIntents.retrieve() internally
 * and will only credit the account if Stripe confirms the payment succeeded.
 * Clients can use this for faster UI feedback, but credits are never issued
 * based on the client's word alone.
 */
router.post('/confirm', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing payment intent ID',
        message: 'Payment intent ID is required'
      });
    }

    const result = await paymentService.confirmPayment(paymentIntentId);

    if (result.alreadyProcessed) {
      return res.json({
        success: true,
        message: 'Payment already processed',
        ...result
      });
    }

    if (!result.verified) {
      return res.status(402).json({
        success: false,
        message: result.message,
        stripeStatus: result.stripeStatus
      });
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      ...result
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      error: 'Failed to confirm payment',
      message: error.message
    });
  }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook endpoint — must receive raw body for signature verification
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  try {
    const event = paymentService.constructWebhookEvent(req.body, signature);
    await paymentService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error', message: error.message });
  }
});

/**
 * GET /api/payments/history
 * 1.6b FIX: was missing await — returned a serialized Promise, not the data
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await paymentService.getPaymentHistory(req.userId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      error: 'Failed to fetch payment history',
      message: error.message
    });
  }
});

/**
 * GET /api/payments/:paymentId
 * 1.6b FIX: was missing await
 */
router.get('/:paymentId', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentService.getPaymentById(parseInt(paymentId), req.userId);

    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
        message: 'The requested payment does not exist'
      });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      error: 'Failed to fetch payment',
      message: error.message
    });
  }
});

module.exports = router;
