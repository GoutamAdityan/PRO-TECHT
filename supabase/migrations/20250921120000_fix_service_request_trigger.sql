CREATE OR REPLACE FUNCTION public.create_service_history_entry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.service_history (service_request_id, status, updated_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.service_history (service_request_id, status, updated_by)
      VALUES (NEW.id, NEW.status, auth.uid());
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;