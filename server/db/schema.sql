-- ========================================================
-- GULLAKGO SUPABASE DATABASE SCHEMA (PostgreSQL)
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vqjhhhxrxwgamowlruuz/sql/new
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255),
  handle VARCHAR(100),
  avatar VARCHAR(10) DEFAULT '⚡',
  level VARCHAR(100) DEFAULT 'Rookie Saver 🌟',
  total_saved NUMERIC(12, 2) DEFAULT 0.00,
  global_streak INT DEFAULT 1,
  parent_linked BOOLEAN DEFAULT FALSE,
  parent_name VARCHAR(255) DEFAULT '',
  parent_email VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. GOALS TABLE
CREATE TABLE IF NOT EXISTS public.goals (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(100) DEFAULT 'bi-piggy-bank',
  target_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) DEFAULT 0.00,
  target_date DATE NOT NULL,
  daily_saving_rate NUMERIC(12, 2) DEFAULT 0.00,
  streak INT DEFAULT 1,
  lock_in BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CONTRIBUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.contributions (
  id VARCHAR(255) PRIMARY KEY,
  goal_id VARCHAR(255) REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  note TEXT DEFAULT 'Daily Streak Contribution 🔥',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(100) DEFAULT 'bi-receipt',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PAYMENT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.payment_history (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES public.profiles(id) ON DELETE CASCADE,
  utr VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'SUCCESS',
  app VARCHAR(100) DEFAULT 'UPI',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) DEFAULT 'free',
  expiry_date TIMESTAMP WITH TIME ZONE,
  daily_usage_count INT DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index optimization
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_goal ON public.contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user ON public.payment_history(user_id);

-- Row Level Security disabled for simple Node.js direct backend access
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
