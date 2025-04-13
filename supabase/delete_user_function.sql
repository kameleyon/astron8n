-- Function to delete a user and their data
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Get the user ID from the current session
  auth_user_id := auth.uid();
  
  -- Check if user exists
  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Delete user data from various tables
  -- Delete from user_credits
  DELETE FROM public.user_credits WHERE user_id = auth_user_id;
  
  -- Delete from subscription_history
  DELETE FROM public.subscription_history WHERE user_id = auth_user_id;
  
  -- Delete from payment_methods
  DELETE FROM public.payment_methods WHERE user_id = auth_user_id;
  
  -- Delete from api_usage
  DELETE FROM public.api_usage WHERE user_id = auth_user_id;
  
  -- Delete from any other tables that contain user data
  -- Add more DELETE statements as needed for your schema
  
  -- Finally, delete the user from auth.users
  -- This requires admin privileges and is typically done through the Supabase Auth API
  -- The client will need to call supabase.auth.admin.deleteUser(auth_user_id)
  -- after this function completes
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;

-- Comment explaining how to use the function
COMMENT ON FUNCTION public.delete_user() IS 'Deletes all data for the currently authenticated user. Must be called by the user who wants to be deleted. After calling this function, you should also delete the user from auth.users using the Supabase Auth API.';
