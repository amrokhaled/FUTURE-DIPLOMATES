-- Admin Users Table for Admin Authentication
-- Run this in your Supabase SQL Editor

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read admin_users table
CREATE POLICY "Admins can view admin_users" ON public.admin_users
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Policy: Only superadmins can insert/update/delete (optional, manage via dashboard)
-- For now, manage admins directly in Supabase dashboard

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Grant access to authenticated users to check their admin status
GRANT SELECT ON public.admin_users TO authenticated;

-- ============================================
-- TO ADD AN ADMIN USER:
-- ============================================
-- 1. First, the user must sign up/login normally
-- 2. Then run this query (replace with actual email):
--
-- INSERT INTO public.admin_users (user_id, email, role)
-- SELECT id, email, 'admin'
-- FROM auth.users
-- WHERE email = 'admin@yourdomain.com';
-- ============================================
