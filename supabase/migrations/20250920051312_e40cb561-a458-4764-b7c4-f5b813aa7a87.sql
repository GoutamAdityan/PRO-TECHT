-- Fix the remaining security warning by setting search_path for create_service_history_entry function
CREATE OR REPLACE FUNCTION public.create_service_history_entry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;