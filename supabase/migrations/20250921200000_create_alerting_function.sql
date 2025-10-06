CREATE OR REPLACE FUNCTION get_expiring_products_for_alerting()
RETURNS TABLE (
  product_id UUID,
  brand TEXT,
  model TEXT,
  warranty_expiry DATE,
  email TEXT,
  full_name TEXT
)
LANGUAGE sql
AS $$
  SELECT
    p.id as product_id,
    p.brand,
    p.model,
    p.warranty_expiry,
    pr.email,
    pr.full_name
  FROM
    products p
  JOIN
    profiles pr ON p.user_id = pr.id
  WHERE
    p.warranty_expiry = (current_date + (p.alert_preference_days || ' days')::interval)::date;
$$;
