-- Ensure api_keys table exists with correct structure
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  api_key text UNIQUE NOT NULL,
  name text NOT NULL,
  enabled boolean DEFAULT true,
  usage_count bigint DEFAULT 0,
  rate_limit bigint DEFAULT 1000,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz,
  expires_at timestamptz
);

-- Create api_usage table for detailed tracking if it doesn't exist
CREATE TABLE IF NOT EXISTS public.api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES public.api_keys(id) NOT NULL,
  endpoint text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for api_keys if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Users can view own API keys'
  ) THEN
    CREATE POLICY "Users can view own API keys"
      ON public.api_keys
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Users can create API keys'
  ) THEN
    CREATE POLICY "Users can create API keys"
      ON public.api_keys
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Users can update own API keys'
  ) THEN
    CREATE POLICY "Users can update own API keys"
      ON public.api_keys
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Users can delete own API keys'
  ) THEN
    CREATE POLICY "Users can delete own API keys"
      ON public.api_keys
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END
$$;

-- Create policies for api_usage if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'api_usage' AND policyname = 'Users can view own API usage'
  ) THEN
    CREATE POLICY "Users can view own API usage"
      ON public.api_usage
      FOR SELECT
      TO authenticated
      USING (
        api_key_id IN (
          SELECT id FROM public.api_keys WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'api_usage' AND policyname = 'System can insert API usage'
  ) THEN
    CREATE POLICY "System can insert API usage"
      ON public.api_usage
      FOR INSERT
      TO authenticated
      WITH CHECK (
        api_key_id IN (
          SELECT id FROM public.api_keys WHERE user_id = auth.uid()
        )
      );
  END IF;
END
$$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'api_keys' AND indexname = 'api_keys_user_id_idx'
  ) THEN
    CREATE INDEX api_keys_user_id_idx ON public.api_keys(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'api_keys' AND indexname = 'api_keys_api_key_idx'
  ) THEN
    CREATE INDEX api_keys_api_key_idx ON public.api_keys(api_key);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'api_usage' AND indexname = 'api_usage_api_key_id_idx'
  ) THEN
    CREATE INDEX api_usage_api_key_id_idx ON public.api_usage(api_key_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'api_usage' AND indexname = 'api_usage_created_at_idx'
  ) THEN
    CREATE INDEX api_usage_created_at_idx ON public.api_usage(created_at DESC);
  END IF;
END
$$;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
