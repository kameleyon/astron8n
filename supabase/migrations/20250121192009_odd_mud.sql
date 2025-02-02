/*
  # Fix messages table

  1. Changes
    - Drop existing table if exists to avoid conflicts
    - Recreate messages table with correct schema
    - Add proper RLS policies
    - Create performance index

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own messages
      - Create new messages
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS messages CASCADE;

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  is_bot boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS messages_user_id_created_at_idx 
  ON messages(user_id, created_at);

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';