-- Add payment status field
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;
