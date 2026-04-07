# Billing Service

Production-ready billing microservice that integrates with self-hosted Lago billing engine.

## Features

- ✅ Complete customer lifecycle management
- ✅ Subscription management (create, upgrade, downgrade, cancel)
- ✅ Usage-based billing with event tracking
- ✅ Invoice management and payment retry
- ✅ Credits/wallet management
- ✅ Coupon application
- ✅ Webhook handling with signature verification
- ✅ Automatic retry mechanism for failed Lago API calls
- ✅ PostgreSQL database with transaction support
- ✅ Bearer token authentication
- ✅ Comprehensive error handling and logging

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Billing Engine**: Lago (self-hosted)
- **Authentication**: Bearer token
- **Job Scheduler**: node-cron
- **Logging**: Morgan + custom logger

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Lago instance running (default: http://localhost:3000)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### 3. Run Database Migration

```bash
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Start Production Server

```bash
npm start
```

## Docker Deployment

Start all services (billing-service + PostgreSQL):

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f billing-service
```

Stop services:

```bash
docker-compose down
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `NODE_ENV` | Environment | development |
| `INTERNAL_API_KEY` | Bearer token for API auth | - |
| `LAGO_API_KEY` | Lago API key | - |
| `LAGO_URL` | Lago instance URL | http://localhost:3000 |
| `LAGO_WEBHOOK_SECRET` | Lago webhook secret | - |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | billing_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |

### Lago Configuration

The following resources must be configured in your Lago instance:

**Billable Metrics:**
- `input_tokens` (SUM)
- `output_tokens` (SUM)
- `api_calls` (COUNT)
- `gpu_seconds` (SUM)
- `storage_gb` (MAX)

**Plans:**
- `starter` - Starter ($29/mo)
- `pro` - Pro ($99/mo)
- `enterprise` - Enterprise ($499/mo)

**Coupons:**
- `launch20` - 20% discount
- `credit50` - $50 fixed credit

## API Documentation

### Authentication

All endpoints except `/health` and `/api/v1/webhooks/lago` require Bearer token authentication:

```bash
Authorization: Bearer <INTERNAL_API_KEY>
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "billing-service",
  "lago_url": "http://localhost:3000",
  "timestamp": "2024-04-06T10:00:00.000Z"
}
```

#### Create Customer

```http
POST /api/v1/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "internal_id": "customer-001",
  "org_id": "org-123",
  "name": "Acme Corp",
  "email": "billing@acme.com",
  "plan_code": "pro"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": { ... },
    "subscription": { ... }
  }
}
```

#### Get Customer

```http
GET /api/v1/customers/:internalId
Authorization: Bearer <token>
```

#### Update Customer

```http
PATCH /api/v1/customers/:internalId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "new@email.com"
}
```

#### Delete Customer

```http
DELETE /api/v1/customers/:internalId
Authorization: Bearer <token>
```

#### Create Subscription

```http
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "internal_customer_id": "customer-001",
  "plan_code": "enterprise",
  "billing_time": "anniversary"
}
```

#### Update Subscription (Upgrade/Downgrade)

```http
PATCH /api/v1/subscriptions/:internalCustomerId
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_code": "enterprise"
}
```

#### Terminate Subscription

```http
DELETE /api/v1/subscriptions/:internalCustomerId
Authorization: Bearer <token>
```

#### Push Event

```http
POST /api/v1/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "internal_customer_id": "customer-001",
  "event_code": "input_tokens",
  "properties": {
    "input_tokens": 1500
  }
}
```

**Note:** `transaction_id` and `timestamp` are auto-generated.

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid-here",
    "event_code": "input_tokens",
    "internal_customer_id": "customer-001"
  }
}
```

#### Push Batch Events

```http
POST /api/v1/events/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "events": [
    {
      "internal_customer_id": "customer-001",
      "event_code": "input_tokens",
      "properties": { "input_tokens": 1500 }
    },
    {
      "internal_customer_id": "customer-001",
      "event_code": "api_calls",
      "properties": {}
    }
  ]
}
```

#### Get Usage

```http
GET /api/v1/events/usage/:internalCustomerId
Authorization: Bearer <token>
```

#### Get Invoices

```http
GET /api/v1/invoices?internal_customer_id=customer-001&status=paid&page=1&per_page=20
Authorization: Bearer <token>
```

#### Get Invoice Details

```http
GET /api/v1/invoices/:invoiceId
Authorization: Bearer <token>
```

#### Retry Payment

```http
POST /api/v1/invoices/:invoiceId/retry
Authorization: Bearer <token>
```

#### Top Up Credits

```http
POST /api/v1/credits/topup
Authorization: Bearer <token>
Content-Type: application/json

{
  "internal_customer_id": "customer-001",
  "amount_cents": 5000,
  "currency": "USD",
  "description": "Manual top-up"
}
```

#### Get Credits

```http
GET /api/v1/credits/:internalCustomerId
Authorization: Bearer <token>
```

#### Apply Coupon

```http
POST /api/v1/coupons/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "internal_customer_id": "customer-001",
  "coupon_code": "launch20"
}
```

#### Remove Coupon

```http
DELETE /api/v1/coupons/:internalCustomerId/:couponCode
Authorization: Bearer <token>
```

#### Webhook Endpoint (Lago)

```http
POST /api/v1/webhooks/lago
X-Lago-Signature: <hmac-signature>
Content-Type: application/json

{
  "webhook_type": "invoice.created",
  ...
}
```

**Note:** No authentication required. Uses HMAC signature verification.

## Webhooks

Configure Lago to send webhooks to: `http://your-domain:4000/api/v1/webhooks/lago`

Supported webhook types:
- `invoice.created`
- `invoice.payment_status_updated`
- `customer.payment_overdue`
- `subscription.terminated`
- `wallet.depleted_ongoing_balance`

## Database Schema

### Tables

- **customer_lago_map**: Maps internal customer IDs to Lago customer IDs
- **subscriptions**: Tracks customer subscriptions
- **webhook_logs**: Logs all received webhooks
- **sync_jobs**: Queues failed Lago operations for retry

## Retry Mechanism

Failed Lago API calls are automatically queued and retried:

- **Retry Interval**: Every 5 minutes
- **Max Attempts**: 3
- **Job Types**: create_customer, push_event, create_subscription

View job stats in the `sync_jobs` table.

## Project Structure

```
billing-service/
├── src/
│   ├── config/          # Configuration (Lago, DB)
│   ├── routes/          # Express route handlers
│   ├── services/        # Lago API service layer
│   ├── db/              # Database queries and migrations
│   ├── middleware/      # Express middleware
│   ├── jobs/            # Cron job scheduler
│   ├── utils/           # Utility functions
│   └── app.js           # Main application entry
├── .env                 # Environment variables
├── package.json
├── docker-compose.yml
└── README.md
```

## Development

### Run Tests

```bash
# Coming soon
npm test
```

### Check Logs

Logs include timestamp, level, and context:

```
[2024-04-06T10:00:00.000Z] [INFO] Billing service listening on port 4000
[2024-04-06T10:00:01.000Z] [INFO] PostgreSQL connected: localhost:5432/billing_db
[2024-04-06T10:00:02.000Z] [INFO] Creating customer in Lago | {"external_id":"customer-001"}
```

## Production Considerations

1. **Environment Variables**: Never commit `.env` - use secrets management
2. **Database Backups**: Schedule regular PostgreSQL backups
3. **Monitoring**: Add APM tools (New Relic, Datadog, etc.)
4. **Rate Limiting**: Add rate limiting middleware
5. **HTTPS**: Use reverse proxy (nginx) with SSL
6. **Logging**: Integrate with centralized logging (ELK, CloudWatch)
7. **Health Checks**: Monitor `/health` endpoint

## Troubleshooting

### Database Connection Errors

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Lago Connection Errors

Verify Lago is accessible:

```bash
curl http://localhost:3000/health
```

### Webhook Signature Verification Fails

Ensure `LAGO_WEBHOOK_SECRET` matches the secret configured in Lago.

## License

MIT

## Support

For issues and questions, please contact your development team.
#   G e t l a g o - b i l l i n g - s e r v i c e  
 