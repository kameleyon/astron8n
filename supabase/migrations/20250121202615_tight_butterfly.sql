/*
  # Fix messages table schema for chat sessions
  
  1. Changes
    - Drop and recreate messages table with proper session support
    - Add session_id and is_favorite columns
    - Add appropriate indexes for performance
  
  2. Security
    - Enable RLS
    - Add policies for user access
    
  3. Indexes
    - session_id for faster session lookups
    - Combined index for efficient session listing
*/

-- Drop existing table
DROP TABLE IF EXISTS public.messages CASCADE;

-- Create messages table with all required columns
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text NOT NULL,
  is_bot boolean DEFAULT false,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies
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

CREATE POLICY "Users can update own messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own messages"
  ON public.messages
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX messages_user_id_idx ON public.messages(user_id);
CREATE INDEX messages_session_id_idx ON public.messages(session_id);
CREATE INDEX messages_user_session_idx ON public.messages(user_id, session_id, created_at DESC);
CREATE INDEX messages_favorite_idx ON public.messages(user_id, is_favorite) WHERE is_favorite = true;

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