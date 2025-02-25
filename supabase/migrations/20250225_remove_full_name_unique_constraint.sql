-- Remove the unique constraint on full_name in user_profiles table
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_full_name_key;
