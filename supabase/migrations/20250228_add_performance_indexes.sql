-- Add performance indexes to improve query speed

-- Function to safely create an index if the table exists
CREATE OR REPLACE FUNCTION create_index_if_table_exists(
    p_table_name text,
    p_index_name text,
    p_column_name text,
    p_index_comment text DEFAULT NULL
) RETURNS void AS $$
DECLARE
    table_exists boolean;
BEGIN
    -- Check if the table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = p_table_name
    ) INTO table_exists;
    
    -- If table exists, create the index
    IF table_exists THEN
        EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I(%I)', 
                      p_index_name, p_table_name, p_column_name);
        
        -- Add comment if provided
        IF p_index_comment IS NOT NULL THEN
            EXECUTE format('COMMENT ON INDEX %I IS %L', 
                          p_index_name, p_index_comment);
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for each table
SELECT create_index_if_table_exists(
    'user_profiles', 
    'idx_user_profiles_user_id', 
    'id',
    'Improves performance of user profile lookups'
);

SELECT create_index_if_table_exists(
    'birth_charts', 
    'idx_birth_charts_user_id', 
    'user_id',
    'Improves performance of birth chart lookups by user'
);

SELECT create_index_if_table_exists(
    'transactions', 
    'idx_transactions_user_id', 
    'user_id',
    'Improves performance of transaction lookups by user'
);

SELECT create_index_if_table_exists(
    'chat_history', 
    'idx_chat_history_user_id', 
    'user_id',
    'Improves performance of chat history lookups by user'
);

SELECT create_index_if_table_exists(
    'chat_history', 
    'idx_chat_history_created_at', 
    'created_at',
    'Improves performance of chat history lookups by date'
);

SELECT create_index_if_table_exists(
    'reports', 
    'idx_reports_user_id', 
    'user_id',
    'Improves performance of report lookups by user'
);

SELECT create_index_if_table_exists(
    'reports', 
    'idx_reports_created_at', 
    'created_at',
    'Improves performance of report lookups by date'
);

SELECT create_index_if_table_exists(
    'api_keys', 
    'idx_api_keys_user_id', 
    'user_id',
    'Improves performance of API key lookups by user'
);

SELECT create_index_if_table_exists(
    'user_credits', 
    'idx_user_credits_user_id', 
    'user_id',
    'Improves performance of user credit lookups'
);

-- Drop the function after use
DROP FUNCTION IF EXISTS create_index_if_table_exists;
