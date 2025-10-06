CREATE OR REPLACE FUNCTION get_products_with_service_counts(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_expiry DATE,
  alert_preference_days INTEGER,
  service_counts JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.brand,
    p.model,
    p.serial_number,
    p.purchase_date,
    p.warranty_expiry,
    p.alert_preference_days,
    COALESCE(s.counts, '{}'::jsonb) as service_counts
  FROM
    products p
  LEFT JOIN (
    SELECT
      sr.product_id,
      jsonb_object_agg(sr.status, sr.count) as counts
    FROM (
      SELECT
        product_id,
        status,
        count(*) as count
      FROM
        service_requests
      GROUP BY
        product_id, status
    ) sr
    GROUP BY
      sr.product_id
  ) s ON p.id = s.product_id
  WHERE
    p.user_id = user_id_param;
END;
$$;
