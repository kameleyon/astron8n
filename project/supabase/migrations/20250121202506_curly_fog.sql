/*
  # Add session_id and is_favorite columns to messages table
  
  1. Changes
    - Add session_id column for grouping messages by conversation
    - Add is_favorite column for marking favorite conversations
    - Add indexes for better query performance
  
  2. Indexes
    - session_id for faster session lookups
    - Combined index for listing sessions efficiently
*/

-- Add new columns
ALTER TABLE public.messages
ADD COLUMN session_id uuid NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN is_favorite boolean DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS messages_session_id_idx 
  ON public.messages(session_id);

CREATE INDEX IF NOT EXISTS messages_user_session_idx 
  ON public.messages(user_id, session_id, created_at DESC);

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';