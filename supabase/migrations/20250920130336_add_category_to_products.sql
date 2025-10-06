
-- Add category column to products table
ALTER TABLE public.products
ADD COLUMN category public.product_category NOT NULL DEFAULT 'other';

-- You might need to update existing rows if you have data and 'other' is not a suitable default.
-- For example: UPDATE public.products SET category = 'other' WHERE category IS NULL;

-- Down migration to remove the category column
ALTER TABLE public.products
DROP COLUMN category;
