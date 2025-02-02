-- Add session_id to messages table
ALTER TABLE public.messages
ADD COLUMN session_id uuid NOT NULL DEFAULT gen_random_uuid();

-- Create index for faster session queries
CREATE INDEX messages_session_id_idx ON public.messages(session_id);

-- Create index for session listing
CREATE INDEX messages_user_session_idx ON public.messages(user_id, session_id, created_at DESC);