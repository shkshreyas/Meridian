/*
  # Driver Wellness Monitoring System Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `display_name` (text)
      - `total_trips` (integer, default 0)
      - `total_distance` (numeric, default 0) - in kilometers
      - `average_wellness_score` (numeric, default 0) - 0-100 scale
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `trips`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, nullable)
      - `distance` (numeric, default 0) - in kilometers
      - `duration` (integer, default 0) - in seconds
      - `wellness_score` (numeric, default 100) - 0-100 scale
      - `alertness_score` (numeric, default 100)
      - `stress_level` (numeric, default 0) - 0-100 scale
      - `drowsiness_events` (integer, default 0)
      - `stress_events` (integer, default 0)
      - `status` (text, default 'active') - active, completed, paused
      - `created_at` (timestamptz)
    
    - `wellness_snapshots`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, references trips)
      - `timestamp` (timestamptz)
      - `heart_rate` (integer, nullable)
      - `alertness_score` (numeric)
      - `stress_level` (numeric)
      - `eye_closure_duration` (numeric, nullable) - in seconds
      - `head_position` (text, nullable) - forward, tilted, etc.
    
    - `badges`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `icon` (text) - icon identifier
      - `category` (text) - safety, wellness, distance, etc.
      - `requirement_value` (numeric) - threshold to unlock
      - `created_at` (timestamptz)
    
    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `badge_id` (uuid, references badges)
      - `earned_at` (timestamptz)
      - Unique constraint on (user_id, badge_id)

  2. Security
    - Enable RLS on all tables
    - Users can read and update their own profile
    - Users can read and insert their own trips
    - Users can read their own wellness snapshots
    - Users can read all badges
    - Users can read their own earned badges
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  total_trips integer NOT NULL DEFAULT 0,
  total_distance numeric NOT NULL DEFAULT 0,
  average_wellness_score numeric NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  distance numeric NOT NULL DEFAULT 0,
  duration integer NOT NULL DEFAULT 0,
  wellness_score numeric NOT NULL DEFAULT 100,
  alertness_score numeric NOT NULL DEFAULT 100,
  stress_level numeric NOT NULL DEFAULT 0,
  drowsiness_events integer NOT NULL DEFAULT 0,
  stress_events integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create wellness_snapshots table
CREATE TABLE IF NOT EXISTS wellness_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  heart_rate integer,
  alertness_score numeric NOT NULL DEFAULT 100,
  stress_level numeric NOT NULL DEFAULT 0,
  eye_closure_duration numeric,
  head_position text
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  requirement_value numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view own trips"
  ON trips FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Wellness snapshots policies
CREATE POLICY "Users can view own wellness snapshots"
  ON wellness_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = wellness_snapshots.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own wellness snapshots"
  ON wellness_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = wellness_snapshots.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Badges policies (public read)
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- User badges policies
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert sample badges
INSERT INTO badges (name, description, icon, category, requirement_value) VALUES
  ('First Journey', 'Complete your first monitored drive', 'award', 'milestone', 1),
  ('Safety Star', 'Complete 10 trips with perfect wellness scores', 'star', 'safety', 10),
  ('Distance Warrior', 'Drive 500km with wellness monitoring', 'map', 'distance', 500),
  ('Mindful Driver', 'Complete 5 pre-drive assessments', 'brain', 'wellness', 5),
  ('Stress Master', 'Maintain low stress for 10 consecutive trips', 'heart', 'wellness', 10),
  ('Alert Champion', 'Complete 20 trips without drowsiness events', 'eye', 'safety', 20),
  ('Century Club', 'Complete 100 monitored trips', 'trophy', 'milestone', 100),
  ('Marathon Runner', 'Drive 1000km with wellness monitoring', 'flag', 'distance', 1000)
ON CONFLICT (name) DO NOTHING;