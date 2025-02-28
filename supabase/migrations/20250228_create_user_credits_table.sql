/*
  # Create user_credits table and subscription handling

  1. New Tables
    - `user_credits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_credits` (integer)
      - `used_credits` (integer)
      - `is_subscriber` (boolean)
      - `subscription_start_date` (timestamptz)
      - `trial_end_date` (timestamptz)
      - `last_payment_date` (timestamptz)
      - `next_payment_date` (timestamptz)
      - `stripe_customer_id` (text)
      - `stripe_subscription_id` (text)
      - `payment_status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_credits` table
    - Add policies for authenticated users to:
      - Read their own credits
      - Update their own credits (via function)
*/

-- Create user_credits table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  total_credits integer DEFAULT 1500,
  used_credits integer DEFAULT 0,
  is_subscriber boolean DEFAULT false,
  subscription_start_date timestamptz,
  trial_end_date timestamptz,
  last_payment_date timestamptz,
  next_payment_date timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  payment_status text DEFAULT 'none',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own credits"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_credits
DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle trial expiration
CREATE OR REPLACE FUNCTION check_trial_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- If trial has ended and user is not a subscriber, update payment_status
  IF NEW.trial_end_date IS NOT NULL AND NEW.trial_end_date < now() AND NOT NEW.is_subscriber THEN
    NEW.payment_status := 'trial_expired';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for trial expiration
DROP TRIGGER IF EXISTS check_trial_expiration_trigger ON user_credits;
CREATE TRIGGER check_trial_expiration_trigger
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION check_trial_expiration();

-- Create function to initialize user credits on signup
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, total_credits, used_credits, is_subscriber, payment_status)
  VALUES (NEW.id, 1500, 0, false, 'trial');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to initialize user credits on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_credits();
