-- Allow Admins to view ALL bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);
