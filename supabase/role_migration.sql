-- =====================================================
-- ROLE-BASED ADMIN SYSTEM
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Step 2: Set admin role for specific emails
UPDATE profiles 
SET role = 'admin' 
WHERE email IN ('meto.khaled011@gmail.com', 'amrokhaled9603@gmail.com');

-- Step 3: Insert profiles for admin users if they don't exist
INSERT INTO profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    'admin'
FROM auth.users 
WHERE email IN ('meto.khaled011@gmail.com', 'amrokhaled9603@gmail.com')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Step 4: Verify the changes
SELECT id, email, full_name, role FROM profiles WHERE role = 'admin';

-- Step 5: (Optional) Drop admin_users table after confirming everything works
-- DROP TABLE IF EXISTS admin_users;
