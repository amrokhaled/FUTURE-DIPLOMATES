-- Allow users to create their own bookings
CREATE POLICY "Users and Guests can create bookings" ON public.bookings FOR INSERT WITH CHECK (
  (auth.role() = 'authenticated' AND auth.uid() = user_id) OR
  (auth.role() = 'anon' AND user_id IS NULL)
);
