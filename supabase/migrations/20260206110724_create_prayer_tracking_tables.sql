/*
  # Create Prayer Tracking Tables

  1. New Tables
    - `users`: User profiles linked to auth.users
    - `daily_prayers`: Tracks daily ada prayer completion/missed status
    - `qaza_logs`: Audit log of qaza additions and clears
    - `qaza_totals`: Running totals of each prayer's qaza count
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access only their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prayer_date DATE NOT NULL,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  completed BOOLEAN DEFAULT false,
  missed BOOLEAN DEFAULT false,
  missed_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, prayer_date, prayer_name),
  CONSTRAINT daily_prayers_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qaza_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  log_date DATE NOT NULL,
  fajr_count INT DEFAULT 0,
  dhuhr_count INT DEFAULT 0,
  asr_count INT DEFAULT 0,
  maghrib_count INT DEFAULT 0,
  isha_count INT DEFAULT 0,
  log_type TEXT NOT NULL CHECK (log_type IN ('added', 'cleared')),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT qaza_logs_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qaza_totals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  fajr_total INT DEFAULT 0,
  dhuhr_total INT DEFAULT 0,
  asr_total INT DEFAULT 0,
  maghrib_total INT DEFAULT 0,
  isha_total INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT qaza_totals_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE daily_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE qaza_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qaza_totals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily prayers"
  ON daily_prayers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily prayers"
  ON daily_prayers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily prayers"
  ON daily_prayers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own qaza logs"
  ON qaza_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own qaza logs"
  ON qaza_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own qaza totals"
  ON qaza_totals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own qaza totals"
  ON qaza_totals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own qaza totals"
  ON qaza_totals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_prayers_user_date ON daily_prayers(user_id, prayer_date);
CREATE INDEX IF NOT EXISTS idx_daily_prayers_prayer_name ON daily_prayers(prayer_name);
CREATE INDEX IF NOT EXISTS idx_qaza_logs_user_date ON qaza_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_qaza_logs_type ON qaza_logs(log_type);
