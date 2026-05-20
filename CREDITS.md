# Credit-Based Payment System Documentation

## Overview

The recap-render-ai project uses a credit-based payment system powered by Stripe. Users purchase credits which are then consumed when generating videos. New users receive 10 free credits upon registration.

## Credit Pricing

### Credit Packages

| Package | Credits | Bonus | Total | Price | Price/Credit |
|---------|---------|-------|-------|-------|--------------|
| Starter | 50 | 0 | 50 | $9.99 | $0.200 |
| Pro | 150 | 10 | 160 | $24.99 | $0.156 |
| Business | 500 | 50 | 550 | $79.99 | $0.145 |
| Enterprise | 2000 | 200 | 2200 | $299.99 | $0.136 |

### Video Generation Costs

**Base Cost (per minute):**
- 720p: 5 credits/minute
- 1080p: 8 credits/minute

**Additional Features:**
- Custom music: +2 credits
- Premium TTS voices: +3 credits
- AI slide enhancement: +4 credits

**Example Calculations:**
- 3-minute 720p video: 15 credits
- 3-minute 1080p video with custom music: 26 credits
- 5-minute 720p video with premium TTS and AI enhancement: 32 credits

*Note: Duration is rounded up to the nearest minute.*

## Database Schema

### users
- `id`: Primary key
- `email`: Unique user email
- `password`: Bcrypt hashed password
- `name`: User's display name
- `credit_balance`: Current credit balance (default: 10)
- `total_credits_purchased`: Lifetime credits purchased
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### credit_packages
- `id`: Primary key
- `name`: Package name (Starter, Pro, Business, Enterprise)
- `credits`: Base credits
- `price`: Price in USD
- `is_active`: Whether package is available for purchase
- `bonus_credits`: Bonus credits included
- `created_at`: Package creation timestamp

### transactions
- `id`: Primary key
- `user_id`: Foreign key to users
- `type`: PURCHASE, DEBIT, REFUND, or BONUS
- `amount`: Credit amount (positive for credits added, negative conceptually for debits)
- `balance_after`: User's balance after transaction
- `description`: Transaction description
- `payment_id`: Foreign key to payments (for PURCHASE type)
- `status`: PENDING, COMPLETED, or FAILED
- `created_at`: Transaction timestamp

### payments
- `id`: Primary key
- `user_id`: Foreign key to users
- `transaction_id`: Foreign key to transactions
- `package_id`: Foreign key to credit_packages
- `amount`: Payment amount in USD
- `currency`: Payment currency (default: usd)
- `payment_method`: STRIPE or PAYPAL
- `payment_intent_id`: Stripe payment intent ID
- `status`: PENDING, COMPLETED, FAILED, or REFUNDED
- `created_at`: Payment creation timestamp
- `completed_at`: Payment completion timestamp

### video_generations
- `id`: Primary key
- `user_id`: Foreign key to users
- `transaction_id`: Foreign key to transactions
- `credits_used`: Credits deducted for this generation
- `duration_seconds`: Video duration
- `resolution`: Video resolution (720p, 1080p)
- `options`: JSON object with generation options
- `status`: PROCESSING, COMPLETED, FAILED, or REFUNDED
- `video_url`: URL to generated video
- `created_at`: Generation start timestamp
- `completed_at`: Generation completion timestamp

## API Endpoints

### Authentication

#### POST /api/auth/signup
Create new user account with 10 free credits.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully. You received 10 free credits!",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "creditBalance": 10
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "creditBalance": 25
  }
}
```

### Credits Management

All credit endpoints require authentication via JWT token in `Authorization: Bearer <token>` header.

#### GET /api/credits/balance
Get user's current credit balance.

**Response:**
```json
{
  "success": true,
  "balance": 25,
  "userId": 1
}
```

#### GET /api/credits/packages
Get available credit packages.

**Response:**
```json
{
  "success": true,
  "packages": [
    {
      "id": 1,
      "name": "Starter",
      "credits": 50,
      "price": 9.99,
      "bonus_credits": 0,
      "totalCredits": 50,
      "pricePerCredit": "0.200"
    }
  ]
}
```

#### GET /api/credits/transactions
Get transaction history with pagination.

**Query Parameters:**
- `limit`: Number of transactions per page (default: 50)
- `offset`: Number of transactions to skip (default: 0)
- `type`: Filter by transaction type (PURCHASE, DEBIT, REFUND, BONUS)

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "user_id": 1,
      "type": "DEBIT",
      "amount": 15,
      "balance_after": 10,
      "description": "Video generation (3min, 720p)",
      "status": "COMPLETED",
      "created_at": "2025-01-12T04:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### POST /api/credits/calculate-cost
Calculate credit cost for video generation.

**Request:**
```json
{
  "durationMinutes": 3,
  "resolution": "720p",
  "customMusic": false,
  "premiumTTS": false,
  "aiEnhancement": false
}
```

**Response:**
```json
{
  "success": true,
  "cost": {
    "breakdown": {
      "video": 15,
      "music": 0,
      "tts": 0,
      "enhancement": 0
    },
    "total": 15,
    "durationMinutes": 3,
    "resolution": "720p"
  },
  "userBalance": 25,
  "canAfford": true,
  "creditsNeeded": 0
}
```

#### GET /api/credits/video-history
Get user's video generation history.

**Query Parameters:**
- `limit`: Number of videos per page (default: 50)
- `offset`: Number of videos to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "videos": [
    {
      "id": 1,
      "user_id": 1,
      "transaction_id": 5,
      "credits_used": 15,
      "duration_seconds": 180,
      "resolution": "720p",
      "options": {},
      "status": "COMPLETED",
      "video_url": "/outputs/videos/lecture_20250112_040000.mp4",
      "created_at": "2025-01-12T04:00:00.000Z",
      "completed_at": "2025-01-12T04:02:30.000Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Payment Integration

#### POST /api/payments/create-intent
Create Stripe payment intent for purchasing credits.

**Request:**
```json
{
  "packageId": 2
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": 1,
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 24.99,
  "credits": 150,
  "bonusCredits": 10,
  "totalCredits": 160
}
```

Use the `clientSecret` with Stripe.js to complete payment on the frontend.

#### POST /api/payments/confirm
Confirm payment after successful Stripe payment (alternative to webhook).

**Request:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "payment": {
    "id": 1,
    "status": "COMPLETED"
  },
  "transaction": {
    "transactionId": 10,
    "amountCredited": 160,
    "balanceAfter": 185
  },
  "totalCredits": 160
}
```

#### POST /api/payments/webhook
Stripe webhook endpoint (must use raw body, not JSON parsed).

This endpoint is called automatically by Stripe for payment events. Requires `stripe-signature` header for verification.

**Handled Events:**
- `payment_intent.succeeded`: Confirms payment and credits user account
- `payment_intent.payment_failed`: Marks payment as failed
- `charge.refunded`: Processes refund and debits credits

#### GET /api/payments/history
Get payment history.

**Query Parameters:**
- `limit`: Number of payments per page (default: 50)
- `offset`: Number of payments to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "id": 1,
      "user_id": 1,
      "package_id": 2,
      "amount": 24.99,
      "status": "COMPLETED",
      "package_name": "Pro",
      "credits": 150,
      "bonus_credits": 10,
      "created_at": "2025-01-12T03:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Video Generation

#### POST /api/video/generate
Generate video (requires authentication and sufficient credits).

**Request:**
```json
{
  "text": "Your lecture content here...",
  "options": {
    "durationMinutes": 3,
    "resolution": "720p",
    "customMusic": false,
    "premiumTTS": false,
    "aiEnhancement": false,
    "theme": "dark",
    "voice": "Zira",
    "rate": 180
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "videoUrl": "/outputs/videos/lecture_20250112_040000.mp4",
  "srtUrl": "/outputs/videos/lecture_20250112_040000.srt",
  "message": "Video generated successfully",
  "creditsUsed": 15,
  "newBalance": 10
}
```

**Response (Insufficient Credits):**
```json
{
  "error": "Insufficient credits",
  "message": "This video requires 15 credits, but you only have 5 credits.",
  "creditsRequired": 15,
  "currentBalance": 5,
  "creditsNeeded": 10
}
```
*HTTP Status: 402 Payment Required*

**Note:** Credits are deducted BEFORE video generation. If generation fails, credits are automatically refunded.

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` in the `server/` directory and configure:

```env
# Required
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret_change_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional
DID_API_KEY=your_did_api_key_here
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Database Initialization

The database schema and default credit packages are automatically created when the server starts. No manual migration needed.

### 4. Stripe Configuration

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Testing Webhooks Locally

Use Stripe CLI for local webhook testing:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payments/webhook

# Copy the webhook signing secret to .env as STRIPE_WEBHOOK_SECRET
```

### 6. Test Cards

Use Stripe test cards for development:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0027 6000 3184`

## Error Handling

### Insufficient Credits (402)
When a user tries to generate a video without enough credits, the API returns a 402 status with details about how many credits are needed.

**Frontend should:**
1. Display the error message
2. Show current balance and credits needed
3. Provide a "Purchase Credits" button linking to the credits page

### Payment Failure
Payment failures are handled automatically:
- Payment record marked as FAILED
- User notified via error response
- Transaction not created

### Video Generation Failure
If video generation fails after credits are deducted:
1. Credits are automatically refunded
2. Video generation record marked as FAILED or REFUNDED
3. Refund transaction created
4. User's balance restored

## Security Considerations

1. **JWT Tokens**: Use strong secrets in production, rotate periodically
2. **Webhook Verification**: Always verify Stripe webhook signatures
3. **Database Transactions**: All credit operations use atomic transactions
4. **Rate Limiting**: Consider implementing rate limiting on payment endpoints
5. **Input Validation**: All inputs are validated before processing
6. **CORS**: Configure CORS appropriately for production
7. **HTTPS**: Always use HTTPS in production for Stripe integration

## Testing Checklist

- [ ] New user registration gives 10 free credits
- [ ] Credit cost calculation is accurate
- [ ] Insufficient credits prevents video generation
- [ ] Credits are deducted before video generation
- [ ] Failed video generation refunds credits
- [ ] Successful payment adds credits to account
- [ ] Webhook handles payment_intent.succeeded
- [ ] Webhook handles payment_intent.payment_failed
- [ ] Transaction history shows all operations
- [ ] Payment history shows completed purchases
- [ ] Video history shows generation records
- [ ] Concurrent requests don't cause double-charging (database transactions)

## Support and Troubleshooting

### Credits not deducted after video generation
Check `video_generations` table for the generation record and associated `transaction_id`. Verify the transaction was created.

### Payment completed but credits not added
Check webhook logs. If webhook failed, you can manually call `/api/payments/confirm` with the `paymentIntentId`.

### Refund not processing
Check `payments` table status. Use Stripe Dashboard to verify refund was issued. The webhook should automatically debit credits.

### User balance incorrect
Check `transactions` table for the user. The `balance_after` field should match the current `credit_balance` in `users` table.

## Future Enhancements

- Email notifications for purchases and low balance
- Credit expiration system (e.g., expire after 1 year)
- Referral bonus system (e.g., 20 credits for referrals)
- Admin panel for package management
- Analytics dashboard for video generation metrics
- Subscription plans with monthly credit allowance
- Enterprise API integration
- Volume discounts for large purchases
