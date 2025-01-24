/*
  # Final Schema Cache Fix

  1. Changes
    - Drop all existing tables and related objects
    - Recreate user_profiles with proper schema
    - Add explicit schema references
    - Force schema cache refresh

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop everything related to user_profiles
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the table with explicit schema references
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  birth_date date,
  birth_time time,
  birth_place text,
  birth_latitude numeric,
  birth_longitude numeric,
  has_unknown_birth_time boolean DEFAULT false,
  has_accepted_terms boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies with explicit schema references
CREATE POLICY "Users can read own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Create updated_at trigger function in public schema
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger with explicit schema references
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Force schema cache refresh with multiple methods
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');

-- Additional cache refresh attempt
COMMENT ON TABLE public.user_profiles IS 'User profiles for birth chart information';

-- Verify the table exists and has the correct columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'birth_latitude'
  ) THEN
    RAISE EXCEPTION 'Table creation failed or birth_latitude column is missing';
  END IF;
END $$;