-- Create table to persist booking requests from the public form
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  point_a TEXT NOT NULL,
  point_b TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  product_type TEXT NOT NULL,
  service_level TEXT NOT NULL DEFAULT 'standard',
  remarks TEXT,
  distance_km NUMERIC,
  duration_min NUMERIC,
  price_total NUMERIC,
  price_breakdown JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure only supported service levels can be stored
ALTER TABLE public.booking_requests
  ADD CONSTRAINT booking_requests_service_level_check
  CHECK (service_level IN ('express', 'standard', 'economy'));

-- Basic status workflow
ALTER TABLE public.booking_requests
  ADD CONSTRAINT booking_requests_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- Enable RLS so we can control access
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even unauthenticated users) to submit a booking request from the public form
CREATE POLICY "Public can create booking requests"
  ON public.booking_requests
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read booking requests for now
CREATE POLICY "Admins can view booking requests"
  ON public.booking_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Index to list newest requests first
CREATE INDEX IF NOT EXISTS booking_requests_created_at_idx
  ON public.booking_requests (created_at DESC);

COMMENT ON TABLE public.booking_requests IS 'Stores delivery booking requests submitted without authentication.';
COMMENT ON COLUMN public.booking_requests.price_breakdown IS 'JSON representation of the price components returned by the pricing engine.';
