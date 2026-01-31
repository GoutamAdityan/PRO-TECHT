-- Function to provision a Service Center for a User (Profile)
-- This creates a Company and a Service Center if they don't exist for the user.
CREATE OR REPLACE FUNCTION public.provision_service_center_for_user(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_company_id UUID;
  v_profile public.profiles%ROWTYPE;
BEGIN
  -- Get profile details
  SELECT * FROM public.profiles WHERE id = user_uuid INTO v_profile;
  
  -- Only proceed if user has 'service_center' role
  IF v_profile.role != 'service_center' THEN
    RETURN;
  END IF;

  -- 1. Check if user already owns a company
  SELECT id INTO v_company_id FROM public.companies WHERE owner_id = user_uuid LIMIT 1;

  -- If not, create a default company
  IF v_company_id IS NULL THEN
    INSERT INTO public.companies (name, owner_id, contact_email, industry)
    VALUES (
      v_profile.full_name || '''s Company', 
      user_uuid, 
      v_profile.email, 
      'Service'
    )
    RETURNING id INTO v_company_id;
  END IF;

  -- 2. Check if a service center exists for this company
  -- For simplicity in this demo, we assume 1 User = 1 Company = 1 Service Center
  IF NOT EXISTS (SELECT 1 FROM public.service_centers WHERE company_id = v_company_id) THEN
    INSERT INTO public.service_centers (
      company_id, 
      name, 
      address, 
      is_active,
      phone,
      email
    )
    VALUES (
      v_company_id,
      v_profile.full_name || '''s Service Center', 
      'Default Address',
      true,
      v_profile.phone,
      v_profile.email
    );
  END IF;
END;
$$;

-- Trigger to auto-provision when a Profile is inserted or updated
CREATE OR REPLACE FUNCTION public.trigger_provision_service_center()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.role = 'service_center' THEN
    PERFORM public.provision_service_center_for_user(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_provision_sc ON public.profiles;

CREATE TRIGGER on_profile_provision_sc
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_provision_service_center();

-- Backfill: Provision for all existing 'service_center' users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.profiles WHERE role = 'service_center' LOOP
    PERFORM public.provision_service_center_for_user(r.id);
  END LOOP;
END;
$$;
