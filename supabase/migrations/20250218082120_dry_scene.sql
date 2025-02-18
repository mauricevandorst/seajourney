/*
  # Create email subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `status` (text) - For tracking subscription status (active, unsubscribed)
  
  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for inserting new subscriptions
    - Add policy for reading subscriptions
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a subscription"
  ON subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (true);