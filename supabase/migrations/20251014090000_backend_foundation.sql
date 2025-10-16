-- Create table to store route quotations (distance, pricing, etc.)
CREATE TABLE public.route_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  point_a TEXT NOT NULL,
  point_b TEXT NOT NULL,
  service_level TEXT NOT NULL,
  weight NUMERIC DEFAULT 0,
  product_type TEXT NOT NULL,
  distance NUMERIC NOT NULL,
  duration NUMERIC NOT NULL,
  price_total NUMERIC NOT NULL,
  price_base NUMERIC NOT NULL,
  price_per_km NUMERIC NOT NULL,
  price_per_min NUMERIC NOT NULL,
  multiplier NUMERIC NOT NULL,
  weight_charge NUMERIC DEFAULT 0,
  product_type_multiplier NUMERIC DEFAULT 1,
  used_fallback BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enforce known service levels
ALTER TABLE public.route_quotes
  ADD CONSTRAINT route_quotes_service_level_check
  CHECK (service_level IN ('express', 'standard', 'economy'));

-- Enable Row Level Security and add policies
ALTER TABLE public.route_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their quotes"
ON public.route_quotes
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their quotes"
ON public.route_quotes
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Index to retrieve newest quotes quickly
CREATE INDEX IF NOT EXISTS route_quotes_user_created_at_idx
  ON public.route_quotes (user_id, created_at DESC);

-- Extend bookings table with quote relationship and pricing metadata
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES public.route_quotes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_type_multiplier NUMERIC DEFAULT 1,
  ADD COLUMN IF NOT EXISTS weight_charge NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS used_fallback BOOLEAN DEFAULT FALSE;

-- Ensure service level is valid on route_quotes as well
COMMENT ON TABLE public.route_quotes IS 'Stores calculated route and pricing information for delivery quotations';
COMMENT ON COLUMN public.route_quotes.used_fallback IS 'True when the haversine fallback was used instead of the routing API';
COMMENT ON COLUMN public.bookings.quote_id IS 'Reference to the quote used to create this booking';
COMMENT ON COLUMN public.bookings.product_type_multiplier IS 'Multiplier applied based on the declared product type';
COMMENT ON COLUMN public.bookings.weight_charge IS 'Surcharge applied based on parcel weight';
COMMENT ON COLUMN public.bookings.used_fallback IS 'True when the booking was created using the distance fallback algorithm';
