-- Revert the permissive "view all" policy for service centers
DROP POLICY IF EXISTS "Service centers can view all service requests" ON public.service_requests;

-- Restore the restrictive "assigned only" policy
-- Service centers can only see requests assigned to them
-- Currently, this is determined by checking if the user owns the company that owns the service center
CREATE POLICY "Service centers can view assigned requests" 
ON public.service_requests FOR SELECT 
USING (
  service_center_id IN (
    SELECT sc.id FROM public.service_centers sc
    JOIN public.companies c ON sc.company_id = c.id
    WHERE c.owner_id = auth.uid()
  )
);

-- Note: This assumes the logged-in user is the Company Owner.
-- If we need to support individual Service Center Employees who are NOT owners, 
-- we will need to add a user mapping to the service_centers table in a future migration.
