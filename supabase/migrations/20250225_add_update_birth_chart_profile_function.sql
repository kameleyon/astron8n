-- Create a function to update birth chart profile fields only
CREATE OR REPLACE FUNCTION update_birth_chart_profile(
  p_user_id uuid,
  p_full_name text,
  p_birth_date date,
  p_birth_time time,
  p_birth_location text,
  p_latitude numeric,
  p_longitude numeric,
  p_has_unknown_birth_time boolean
) RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET 
    full_name = p_full_name,
    birth_date = p_birth_date,
    birth_time = p_birth_time,
    birth_location = p_birth_location,
    latitude = p_latitude,
    longitude = p_longitude,
    has_unknown_birth_time = p_has_unknown_birth_time,
    updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_birth_chart_profile TO authenticated;
