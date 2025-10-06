-- Add role column to profiles table to fix signup error
-- First create the user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('consumer', 'business_partner', 'service_center');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the role column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'consumer' NOT NULL;