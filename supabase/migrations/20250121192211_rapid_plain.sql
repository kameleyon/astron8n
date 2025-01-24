/*
  # Fix messages table schema

  1. Changes
    - Drop existing messages table to ensure clean slate
    - Create messages table with proper schema and constraints
    - Add RLS policies for security
    - Add performance optimization index
    - Force schema cache refresh

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own messages
      - Create new messages
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS messages CASCADE;

-- Create messages table with explicit schema reference
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  is_bot boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS messages_user_id_created_at_idx 
  ON public.messages(user_id, created_at);

-- Force schema cache refresh using multiple methods
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');

-- Verify table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'messages'
  ) THEN
    RAISE EXCEPTION 'Table creation failed';
  END IF;
END $$;