/*
  # Fix Column Names

  1. Changes
    - Rename columns to match existing schema
    - Preserve data
    - Keep RLS policies intact

  2. Security
    - Maintain existing RLS policies
*/

-- Rename columns to match existing schema
ALTER TABLE public.user_profiles
  RENAME COLUMN birth_latitude TO latitude;

ALTER TABLE public.user_profiles  
  RENAME COLUMN birth_longitude TO longitude;

ALTER TABLE public.user_profiles
  RENAME COLUMN birth_place TO birth_location;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');