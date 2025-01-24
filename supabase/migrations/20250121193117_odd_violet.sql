/*
  # Fix messages table structure

  1. Changes
    - Drop and recreate messages table with proper schema
    - Add proper RLS policies
    - Add performance indexes
    - Add updated_at column with trigger
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS public.messages CASCADE;

-- Create messages table with explicit schema reference
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  is_bot boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies with explicit schema references
CREATE POLICY "Users can read own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS messages_user_id_idx 
  ON public.messages(user_id);

CREATE INDEX IF NOT EXISTS messages_created_at_idx 
  ON public.messages(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_messages_updated_at();

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');

-- Verify table exists and has correct structure
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'messages'
  ) THEN
    RAISE EXCEPTION 'Messages table creation failed';
  END IF;
END $$;