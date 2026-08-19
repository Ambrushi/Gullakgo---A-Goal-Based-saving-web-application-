export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  handle?: string;
  avatar?: string;
  level?: string;
  total_saved: number;
  global_streak: number;
  parent_linked: boolean;
  parent_name?: string;
  parent_email?: string;
  created_at?: string;
}

export interface Contribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  note?: string;
  date: string;
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: string;
  icon?: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  daily_saving_rate: number;
  streak: number;
  lock_in: boolean;
  status: 'active' | 'completed' | 'paused';
  contributions?: Contribution[];
  created_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  icon?: string;
  date: string;
  created_at?: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  utr: string;
  type: string;
  description?: string;
  amount: number;
  status: string;
  app?: string;
  date: string;
  created_at?: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  expiry_date?: string | null;
  daily_usage_count: number;
  last_reset_date: string;
}
