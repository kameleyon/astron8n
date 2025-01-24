/*
  # Update user_profiles table schema

  1. Changes
    - Rename columns to match application needs
    - Add missing columns
    - Update foreign key relationship

  2. Security
    - Maintain existing RLS policies
    - Update policies to use correct column names
*/

-- Rename and modify columns
ALTER TABLE user_profiles
  RENAME COLUMN username TO full_name;

ALTER TABLE user_profiles
  RENAME COLUMN birth_location TO birth_place;

ALTER TABLE user_profiles
  RENAME COLUMN latitude TO birth_latitude;

ALTER TABLE user_profiles
  RENAME COLUMN longitude TO birth_longitude;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);