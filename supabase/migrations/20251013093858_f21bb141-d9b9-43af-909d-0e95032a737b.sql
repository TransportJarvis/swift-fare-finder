-- Add pricing and service level fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS service_level text NOT NULL DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS estimated_duration numeric,
ADD COLUMN IF NOT EXISTS price_base numeric,
ADD COLUMN IF NOT EXISTS price_per_km numeric,
ADD COLUMN IF NOT EXISTS price_per_min numeric,
ADD COLUMN IF NOT EXISTS multiplier numeric DEFAULT 1.0;

-- Add constraint for service levels
ALTER TABLE public.bookings 
ADD CONSTRAINT valid_service_level 
CHECK (service_level IN ('express', 'standard', 'economy'));

COMMENT ON COLUMN public.bookings.service_level IS 'Service level: express, standard, or economy';
COMMENT ON COLUMN public.bookings.estimated_duration IS 'Estimated duration in minutes';
COMMENT ON COLUMN public.bookings.price_base IS 'Base price component';
COMMENT ON COLUMN public.bookings.price_per_km IS 'Price per kilometer component';
COMMENT ON COLUMN public.bookings.price_per_min IS 'Price per minute component';
COMMENT ON COLUMN public.bookings.multiplier IS 'Price multiplier (surge pricing, etc.)';