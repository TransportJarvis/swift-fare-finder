BEGIN;

DROP POLICY IF EXISTS "Public can create booking requests" ON public.booking_requests;

CREATE POLICY "Service role can create booking requests"
  ON public.booking_requests
  FOR INSERT
  TO public
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can create booking requests"
  ON public.booking_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

COMMIT;
