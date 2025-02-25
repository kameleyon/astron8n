-- Check all constraints on the user_profiles table
SELECT conname, contype, pg_get_constraintdef(c.oid)
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE t.relname = 'user_profiles'
AND n.nspname = 'public';
