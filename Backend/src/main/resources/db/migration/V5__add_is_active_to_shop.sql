-- Add is_active column to shop table with safe backfill
-- Compatible with PostgreSQL and MySQL 8+

-- 1) Add column if missing
ALTER TABLE shop ADD COLUMN IF NOT EXISTS is_active BOOLEAN;

-- 2) Backfill existing rows to TRUE
UPDATE shop SET is_active = TRUE WHERE is_active IS NULL;

-- 3) Enforce NOT NULL and default TRUE going forward
ALTER TABLE shop ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE shop ALTER COLUMN is_active SET NOT NULL;