/*
  # Add birth coordinates columns

  1. Changes
    - Add birth_latitude and birth_longitude columns to user_profiles table
    - Add has_unknown_birth_time column
    - Add has_accepted_terms column

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS birth_latitude numeric,
ADD COLUMN IF NOT EXISTS birth_longitude numeric,
ADD COLUMN IF NOT EXISTS has_unknown_birth_time boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_accepted_terms boolean DEFAULT false;