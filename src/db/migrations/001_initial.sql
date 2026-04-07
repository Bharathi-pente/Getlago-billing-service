CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS customer_lago_map (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_id   VARCHAR NOT NULL UNIQUE,
  lago_id       VARCHAR NOT NULL UNIQUE,
  org_id        VARCHAR,
  email         VARCHAR,
  name          VARCHAR,
  plan_code     VARCHAR,
  synced_at     TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL REFERENCES customer_lago_map(id) ON DELETE CASCADE,
  lago_sub_id   VARCHAR NOT NULL UNIQUE,
  plan_code     VARCHAR NOT NULL,
  status        VARCHAR NOT NULL DEFAULT 'active',
  started_at    TIMESTAMP,
  ended_at      TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lago_event_id   VARCHAR NOT NULL UNIQUE,
  webhook_type    VARCHAR NOT NULL,
  payload         JSONB,
  status          VARCHAR NOT NULL DEFAULT 'received',
  processed_at    TIMESTAMP,
  error_message   TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type      VARCHAR NOT NULL,
  payload       JSONB NOT NULL,
  status        VARCHAR NOT NULL DEFAULT 'pending',
  attempts      INT DEFAULT 0,
  max_attempts  INT DEFAULT 3,
  last_error    TEXT,
  next_retry_at TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);
