/*
  # Create API Keys Table
  
  1. Structure
    - Create api_keys table with required fields
    - Add usage tracking and rate limiting
    
  2. Security
    - Enable RLS
    - Add policies for user access
    
  3. Indexes
    - api_key for fast lookups
    - user_id for efficient filtering
*/

-- Create api_keys table
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

-- Create api_usage table for detailed tracking
CREATE TABLE IF NOT EXISTS public.api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES public.api_keys(id) NOT NULL,
  endpoint text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for api_keys
CREATE POLICY "Users can view own API keys"
  ON public.api_keys
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create API keys"
  ON public.api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
  ON public.api_keys
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys"
  ON public.api_keys
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for api_usage
CREATE POLICY "Users can view own API usage"
  ON public.api_usage
  FOR SELECT
  TO authenticated
  USING (
    api_key_id IN (
      SELECT id FROM public.api_keys WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert API usage"
  ON public.api_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (
    api_key_id IN (
      SELECT id FROM public.api_keys WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX api_keys_user_id_idx ON public.api_keys(user_id);
CREATE INDEX api_keys_api_key_idx ON public.api_keys(api_key);
CREATE INDEX api_usage_api_key_id_idx ON public.api_usage(api_key_id);
CREATE INDEX api_usage_created_at_idx ON public.api_usage(created_at DESC);

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
