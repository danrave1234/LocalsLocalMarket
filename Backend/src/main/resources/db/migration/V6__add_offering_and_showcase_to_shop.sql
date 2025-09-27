-- Add offeringType and showcasePriority to shop table
ALTER TABLE shop
  ADD COLUMN IF NOT EXISTS offering_type VARCHAR(32) NOT NULL DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS showcase_priority VARCHAR(32) NOT NULL DEFAULT 'products';

-- Backfill existing rows to defaults (safe no-op if defaults applied)
UPDATE shop SET offering_type = COALESCE(offering_type, 'both');
UPDATE shop SET showcase_priority = COALESCE(showcase_priority, 'products');







