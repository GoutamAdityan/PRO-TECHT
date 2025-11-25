-- Allow service centers to view ALL service requests, not just assigned ones
-- This fixes the issue where service centers couldn't see new unassigned requests

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Service centers can view assigned requests" ON public.service_requests;

-- Create a new policy that allows service centers to view all requests
CREATE POLICY "Service centers can view all service requests" 
ON public.service_requests FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'service_center'
  )
);

-- Keep the update policy as is (only for assigned requests)
-- This ensures service centers can only update requests assigned to them

-- Allow service centers to view all products (to see product details in service requests)
DROP POLICY IF EXISTS "Service centers can view all products" ON public.products;
CREATE POLICY "Service centers can view all products"
ON public.products FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'service_center'
  )
);

-- Allow service centers to view all profiles (to see customer names in service requests)
DROP POLICY IF EXISTS "Service centers can view all profiles" ON public.profiles;
CREATE POLICY "Service centers can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'service_center'
  )
);
