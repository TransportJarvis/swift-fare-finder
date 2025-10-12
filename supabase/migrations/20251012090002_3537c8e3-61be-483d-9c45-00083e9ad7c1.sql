-- Create a table for contact requests
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact requests (public form)
CREATE POLICY "Anyone can submit contact requests"
ON public.contact_requests
FOR INSERT
WITH CHECK (true);

-- Create policy for admins to view contact requests (for future admin panel)
CREATE POLICY "Only admins can view contact requests"
ON public.contact_requests
FOR SELECT
USING (false); -- For now, no one can view. Will be updated when admin system is added

-- Create index for better performance
CREATE INDEX idx_contact_requests_created_at ON public.contact_requests(created_at DESC);