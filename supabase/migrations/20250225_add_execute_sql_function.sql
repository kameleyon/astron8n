-- Create a function to execute raw SQL queries
-- This is a fallback for when the update_birth_chart_profile function is not available
CREATE OR REPLACE FUNCTION execute_sql(
  sql text,
  params text[] DEFAULT '{}'::text[]
) RETURNS void AS $$
DECLARE
  query text;
  i int;
BEGIN
  query := sql;
  
  -- Replace parameter placeholders
  FOR i IN 1..array_length(params, 1) LOOP
    query := replace(query, '$' || i::text, quote_literal(params[i]));
  END LOOP;
  
  -- Execute the query
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION execute_sql TO authenticated;
