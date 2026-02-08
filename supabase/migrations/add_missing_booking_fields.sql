-- Add missing fields from registration form to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_plan TEXT,
ADD COLUMN IF NOT EXISTS investment_amount TEXT,
ADD COLUMN IF NOT EXISTS accommodation BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS referral_other TEXT;
