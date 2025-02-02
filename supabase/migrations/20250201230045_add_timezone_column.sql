-- Add timezone column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN timezone TEXT;

-- Update existing rows to use a default timezone (UTC)
UPDATE user_profiles
SET timezone = 'UTC'
WHERE timezone IS NULL;
