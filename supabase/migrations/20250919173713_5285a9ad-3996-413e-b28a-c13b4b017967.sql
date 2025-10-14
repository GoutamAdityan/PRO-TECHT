-- Create enum for user roles
-- Create enum for user roles (idempotent - only create if missing)
DO LineNumber
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_role'
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    CREATE TYPE public.user_role AS ENUM ('consumer', 'business_partner', 'service_center');
  END IF;
END
LineNumber;

-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('electronics', 'appliances', 'automotive', 'furniture', 'tools', 'other');

-- Create enum for service request status
CREATE TYPE public.service_request_status AS ENUM ('submitted', 'assigned', 'in_progress', 'completed', 'cancelled');

-- Create enum for priority levels
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'consumer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  warranty_policies JSONB DEFAULT '{}',
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_centers table
CREATE TABLE public.service_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  operating_hours JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category product_category NOT NULL,
  serial_number TEXT,
  purchase_date DATE NOT NULL,
  purchase_price DECIMAL(10, 2),
  retailer TEXT,
  warranty_months INTEGER DEFAULT 12,
  warranty_expiry DATE GENERATED ALWAYS AS (purchase_date + INTERVAL '1 month' * warranty_months) STORED,
  receipt_url TEXT,
  product_image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_center_id UUID REFERENCES public.service_centers(id),
  issue_description TEXT NOT NULL,
  issue_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  status service_request_status NOT NULL DEFAULT 'submitted',
  priority priority_level DEFAULT 'medium',
  appointment_date TIMESTAMPTZ,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_history table
CREATE TABLE public.service_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  status service_request_status NOT NULL,
  notes TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;

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

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_warranty_expiry ON public.products(warranty_expiry);
CREATE INDEX idx_service_requests_user_id ON public.service_requests(user_id);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);
CREATE INDEX idx_service_centers_location ON public.service_centers(latitude, longitude);
CREATE INDEX idx_service_history_request_id ON public.service_history(service_request_id);

-- Create function to automatically create service history entries
CREATE OR REPLACE FUNCTION public.create_service_history_entry()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic service history
CREATE TRIGGER service_request_history_trigger
  AFTER INSERT OR UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.create_service_history_entry();
