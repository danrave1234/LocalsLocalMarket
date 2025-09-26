-- Add email verification fields to users table
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP NULL;

-- Backfill: mark users created via OAuth later if needed (left as default false)

