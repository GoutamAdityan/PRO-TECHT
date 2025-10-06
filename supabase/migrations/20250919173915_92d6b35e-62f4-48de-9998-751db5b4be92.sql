-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create RLS policies for companies
CREATE POLICY "Company owners can manage their companies" 
ON public.companies FOR ALL 
USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can view companies" 
ON public.companies FOR SELECT 
USING (true);

-- Create RLS policies for service_centers
CREATE POLICY "Company owners can manage their service centers" 
ON public.service_centers 
FOR ALL 
USING (company_id IN (
  SELECT id FROM public.companies WHERE owner_id = auth.uid()
));

CREATE POLICY "Anyone can view active service centers" 
ON public.service_centers FOR SELECT 
USING (is_active = true);

-- Create RLS policies for products
CREATE POLICY "Users can manage their own products" 
ON public.products FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for service_requests
CREATE POLICY "Users can manage their own service requests" 
ON public.service_requests FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Service centers can view assigned requests" 
ON public.service_requests FOR SELECT 
USING (service_center_id IN (
  SELECT sc.id FROM public.service_centers sc
  JOIN public.companies c ON sc.company_id = c.id
  JOIN public.profiles p ON c.owner_id = p.id
  WHERE p.id = auth.uid()
));

CREATE POLICY "Service centers can update assigned requests" 
ON public.service_requests FOR UPDATE 
USING (service_center_id IN (
  SELECT sc.id FROM public.service_centers sc
  JOIN public.companies c ON sc.company_id = c.id
  JOIN public.profiles p ON c.owner_id = p.id
  WHERE p.id = auth.uid()
));

-- Create RLS policies for service_history
CREATE POLICY "Users can view history of their service requests" 
ON public.service_history FOR SELECT 
USING (service_request_id IN (
  SELECT id FROM public.service_requests WHERE user_id = auth.uid()
));

CREATE POLICY "Service centers can manage history of their requests" 
ON public.service_history FOR ALL 
USING (service_request_id IN (
  SELECT sr.id FROM public.service_requests sr
  JOIN public.service_centers sc ON sr.service_center_id = sc.id
  JOIN public.companies c ON sc.company_id = c.id
  JOIN public.profiles p ON c.owner_id = p.id
  WHERE p.id = auth.uid()
));

-- Create function to handle new user signup with proper security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'consumer')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps with proper security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_centers_updated_at BEFORE UPDATE ON public.service_centers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_warranty_expiry ON public.products(warranty_expiry);
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_centers_location ON public.service_centers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_service_history_request_id ON public.service_history(service_request_id);

-- Create function to automatically create service history entries with proper security
CREATE OR REPLACE FUNCTION public.create_service_history_entry()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create history entry if status changed
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.service_history (service_request_id, status, updated_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.service_history (service_request_id, status, updated_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for automatic service history
CREATE TRIGGER service_request_history_trigger
  AFTER INSERT OR UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.create_service_history_entry();