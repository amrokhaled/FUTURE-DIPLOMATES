-- 1. Create Summits Table (CMS)
CREATE TABLE IF NOT EXISTS summits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    city TEXT NOT NULL,
    dates TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Update Bookings Table (For Admin Control)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS custom_amount NUMERIC, -- Overrides default price (750-1100)
ADD COLUMN IF NOT EXISTS admin_notes TEXT,      -- Internal comments
ADD COLUMN IF NOT EXISTS reviewed_by UUID,      -- Link to admin user
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'; -- Ensure status exists

-- 3. Enable RLS
ALTER TABLE summits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Drop first to avoid "already exists" errors)

-- Summits Policies
DROP POLICY IF EXISTS "Public can view active summits" ON summits;
CREATE POLICY "Public can view active summits" 
ON summits FOR SELECT 
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage summits" ON summits;
CREATE POLICY "Admins can manage summits" 
ON summits FOR ALL 
USING (
    auth.jwt() ->> 'email' IN (
        'meto.khaled011@gmail.com', 
        'amrokhaled9603@gmail.com', 
        'admin@futurediplomates.com'
    )
);

-- Bookings Policies
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
CREATE POLICY "Admins can view all bookings" 
ON bookings FOR SELECT 
USING (
    auth.jwt() ->> 'email' IN (
        'meto.khaled011@gmail.com', 
        'amrokhaled9603@gmail.com', 
        'admin@futurediplomates.com'
    )
);

DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
CREATE POLICY "Admins can update bookings" 
ON bookings FOR UPDATE 
USING (
    auth.jwt() ->> 'email' IN (
        'meto.khaled011@gmail.com', 
        'amrokhaled9603@gmail.com', 
        'admin@futurediplomates.com'
    )
);

-- 5. Insert Initial Data (Idempotent insert checks if city exists)
INSERT INTO summits (city, dates, description, image_url)
SELECT 'Cairo, Egypt', 'July 15-20, 2026', 'Join us in the heart of Egypt for an unforgettable diplomatic experience at the pyramids.', 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2940&auto=format&fit=crop'
WHERE NOT EXISTS (
    SELECT 1 FROM summits WHERE city = 'Cairo, Egypt'
);
