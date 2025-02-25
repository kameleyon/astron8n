-- Drop the specific username constraint on full_name
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_username_key;
