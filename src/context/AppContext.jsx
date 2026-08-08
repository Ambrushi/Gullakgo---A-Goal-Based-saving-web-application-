import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialGoals = [
  {
    id: '1',
    title: 'PlayStation 5 Digital Edition',
    category: 'Product',
    icon: 'bi-controller',
    targetAmount: 45000,
    currentAmount: 32000,
    targetDate: '2026-10-15',
    streak: 8,
    lockIn: true,
    status: 'active',
    contributions: [
      { id: 'c1', date: '2026-08-02', amount: 2000, note: 'Daily Pocket Money Top-up 🔥' },
      { id: 'c2', date: '2026-07-28', amount: 10000, note: 'Birthday Gift from Uncle 🎉' },
      { id: 'c3', date: '2026-07-15', amount: 5000, note: 'Coding Competition Prize 💻' },
      { id: 'c4', date: '2026-07-01', amount: 15000, note: 'Initial Gullak Savings 💰' }
    ]
  },
  {
    id: '2',
    title: 'IMAX Movie Night with Squad',
    category: 'Movie',
    icon: 'bi-film',
    targetAmount: 1200,
    currentAmount: 950,
    targetDate: '2026-08-10',
    streak: 5,
    lockIn: false,
    status: 'active',
    contributions: [
      { id: 'c5', date: '2026-08-01', amount: 450, note: 'Weekly Chores Allowance 💵' },
      { id: 'c6', date: '2026-07-25', amount: 500, note: 'Recycling Bottles ♻️' }
    ]
  },
  {
    id: '3',
    title: 'Nike Air Jordan Kicks',
    category: 'Fashion',
    icon: 'bi-box-seam',
    targetAmount: 11999,
    currentAmount: 6500,
    targetDate: '2026-11-20',
    streak: 4,
    lockIn: true,
    status: 'active',
    contributions: [
      { id: 'c7', date: '2026-08-03', amount: 1500, note: 'Dog Walking Chores 🐕' },
      { id: 'c8', date: '2026-07-20', amount: 5000, note: 'Festival Gift 🧧' }
    ]
  },
  {
    id: '4',
    title: 'Noise Bluetooth Headphones',
    category: 'Product',
    icon: 'bi-headphones',
    targetAmount: 2499,
    currentAmount: 2499,
    targetDate: '2026-06-01',
    streak: 14,
    lockIn: false,
    status: 'completed',
    contributions: [
      { id: 'c9', date: '2026-05-20', amount: 2499, note: 'Goal Achieved! 🎉' }
    ]
  }
];

const initialExpenses = [
  { id: 'e1', title: 'Boba Milk Tea & Fries', amount: 220, category: 'Snacks & Drinks', date: '2026-08-03', icon: 'bi-cup-straw' },
  { id: 'e2', title: 'BGMI Royale Pass', amount: 499, category: 'Gaming', date: '2026-08-01', icon: 'bi-controller' },
  { id: 'e3', title: 'CBSE Physics Guide', amount: 380, category: 'Books & School', date: '2026-07-29', icon: 'bi-book' },
  { id: 'e4', title: 'Go-Karting Pass', amount: 750, category: 'Outings', date: '2026-07-26', icon: 'bi-ticket-detailed' },
  { id: 'e5', title: 'Samosa & Cold Coffee', amount: 120, category: 'Snacks & Drinks', date: '2026-07-20', icon: 'bi-egg-fried' }
];

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free Teen Starter',
    price: 0,
    period: 'forever',
    dailyLimit: 3,
    badge: 'FREE TIER',
    color: '#6B7280',
    description: '3 AI Coach Prompts per day to test the waters'
  },
  daily: {
    id: 'daily',
    name: 'Daily Pass',
    price: 10,
    period: 'day',
    dailyLimit: 15,
    badge: 'POCKET FRIENDLY ⚡',
    color: '#3B82F6',
    description: '15 AI Coach Prompts per day — perfect for quick advice'
  },
  weekly: {
    id: 'weekly',
    name: 'Weekly Saver',
    price: 49,
    period: 'week',
    dailyLimit: 50,
    badge: 'MOST POPULAR 🔥',
    color: '#8B5CF6',
    description: '50 AI Coach Prompts per day + Goal optimization tips'
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 149,
    period: 'month',
    dailyLimit: 200,
    badge: 'MAX SAVINGS 🏆',
    color: '#EC4899',
    description: '200 Prompts/day + AI Spending Audit & Parent Reports'
  }
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'dark'

  const [user, setUser] = useState({
    name: 'Aarav Sharma',
    handle: '@aarav_saver',
    avatar: '⚡',
    level: 'Savings Champion 🏆',
    totalSaved: 41949,
    globalStreak: 8,
    parentLinked: true,
    parentName: 'Rajesh Sharma (Dad)',
    parentEmail: 'rajesh.sharma@example.com'
  });

  const [goals, setGoals] = useState(initialGoals);
  const [expenses, setExpenses] = useState(initialExpenses);

  // Subscription & AI Prompt Usage State
  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem('gullak_subscription');
    return saved ? JSON.parse(saved) : { planId: 'free', expiryDate: null };
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim()) {
      return envKey.trim();
    }
    return localStorage.getItem('gullak_gemini_api_key') || '';
  });

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [aiUsage, setAiUsage] = useState(() => {
    const saved = localStorage.getItem('gullak_ai_usage');
    const today = getTodayStr();
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.lastResetDate === today) {
        return parsed;
      }
    }
    return { count: 0, lastResetDate: today };
  });

  // Daily reset check on mount / interval
  useEffect(() => {
    const today = getTodayStr();
    if (aiUsage.lastResetDate !== today) {
      const newUsage = { count: 0, lastResetDate: today };
      setAiUsage(newUsage);
      localStorage.setItem('gullak_ai_usage', JSON.stringify(newUsage));
    }
  }, []);

  const saveGeminiApiKey = (key) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('gullak_gemini_api_key', key);
  };

  const currentPlan = SUBSCRIPTION_PLANS[subscription.planId] || SUBSCRIPTION_PLANS.free;

  const getRemainingPrompts = () => {
    const today = getTodayStr();
    const currentCount = aiUsage.lastResetDate === today ? aiUsage.count : 0;
    const limit = currentPlan.dailyLimit;
    const remaining = Math.max(0, limit - currentCount);
    return {
      count: currentCount,
      limit,
      remaining,
      plan: currentPlan
    };
  };

  const canSendAIPrompt = () => {
    const { remaining } = getRemainingPrompts();
    return remaining > 0;
  };

  const incrementAIUsage = () => {
    const today = getTodayStr();
    setAiUsage(prev => {
      const currentCount = prev.lastResetDate === today ? prev.count : 0;
      const updated = { count: currentCount + 1, lastResetDate: today };
      localStorage.setItem('gullak_ai_usage', JSON.stringify(updated));
      return updated;
    });
  };

  const subscribeToPlan = (planId) => {
    const targetPlan = SUBSCRIPTION_PLANS[planId];
    if (!targetPlan) return;

    let expiry = new Date();
    if (planId === 'daily') expiry.setDate(expiry.getDate() + 1);
    else if (planId === 'weekly') expiry.setDate(expiry.getDate() + 7);
    else if (planId === 'monthly') expiry.setDate(expiry.getDate() + 30);
    else expiry = null;

    const newSub = {
      planId,
      expiryDate: expiry ? expiry.toISOString() : null
    };

    setSubscription(newSub);
    localStorage.setItem('gullak_subscription', JSON.stringify(newSub));

    // Reset daily usage upon upgrading
    const today = getTodayStr();
    const resetUsage = { count: 0, lastResetDate: today };
    setAiUsage(resetUsage);
    localStorage.setItem('gullak_ai_usage', JSON.stringify(resetUsage));
  };

  // Apply dark mode class to html element
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.body.classList.remove('dark-theme');
    }
  }, [themeMode]);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('gullak_registered_users');
    if (saved) return JSON.parse(saved);
    return [
      {
        name: 'Aarav Sharma',
        mobile: '9876543210',
        email: 'aarav@example.com',
        password: 'password123',
        handle: '@aarav_saver',
        avatar: '⚡',
        level: 'Savings Champion 🏆',
        totalSaved: 41949,
        globalStreak: 8,
        parentLinked: true,
        parentName: 'Rajesh Sharma (Dad)',
        parentEmail: 'rajesh.sharma@example.com'
      }
    ];
  });

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const signUp = ({ name, mobile, email, password }) => {
    const existing = registeredUsers.find(u => u.mobile === mobile);
    if (existing) {
      return { success: false, message: 'This mobile number is already registered!' };
    }

    const newUser = {
      name,
      mobile,
      email,
      password,
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: '⚡',
      level: 'Rookie Saver 🌟',
      totalSaved: 0,
      globalStreak: 1,
      parentLinked: false,
      parentName: '',
      parentEmail: ''
    };

    const updatedList = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedList);
    localStorage.setItem('gullak_registered_users', JSON.stringify(updatedList));

    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const loginWithMobile = ({ mobile, password }) => {
    const foundUser = registeredUsers.find(
      u => u.mobile === mobile && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: 'Invalid Mobile Number or Password' };
  };

  const login = (nameStr) => {
    if (nameStr) {
      setUser(prev => ({
        ...prev,
        name: nameStr,
        handle: `@${nameStr.toLowerCase().replace(/\s+/g, '_')}`
      }));
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const completeOnboarding = (userData) => {
    if (userData) {
      setUser(prev => ({ ...prev, ...userData }));
    }
    setIsAuthenticated(true);
  };

  const addGoal = (newGoal) => {
    const goalWithId = {
      ...newGoal,
      id: Date.now().toString(),
      currentAmount: 0,
      streak: 1,
      status: 'active',
      contributions: []
    };
    setGoals(prev => [goalWithId, ...prev]);
  };

  const addContribution = (goalId, amount, note = 'Daily Streak Contribution 🔥') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newCurrent = goal.currentAmount + numAmount;
          const updatedContributions = [
            {
              id: 'c_' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              amount: numAmount,
              note
            },
            ...goal.contributions
          ];
          const isCompleted = newCurrent >= goal.targetAmount;
          return {
            ...goal,
            currentAmount: newCurrent,
            streak: goal.streak + 1,
            status: isCompleted ? 'completed' : goal.status,
            contributions: updatedContributions
          };
        }
        return goal;
      })
    );

    setUser(prev => ({
      ...prev,
      totalSaved: prev.totalSaved + numAmount,
      globalStreak: prev.globalStreak + 1
    }));
  };

  const addExpense = (newExpense) => {
    const expenseWithId = {
      ...newExpense,
      id: 'e_' + Date.now(),
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [expenseWithId, ...prev]);
  };

  const toggleParentLink = (linkedStatus, parentInfo = {}) => {
    setUser(prev => ({
      ...prev,
      parentLinked: linkedStatus,
      parentName: parentInfo.parentName || prev.parentName,
      parentEmail: parentInfo.parentEmail || prev.parentEmail
    }));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        signUp,
        loginWithMobile,
        logout,
        themeMode,
        toggleTheme,
        completeOnboarding,
        user,
        goals,
        expenses,
        addGoal,
        addContribution,
        addExpense,
        toggleParentLink,
        subscription,
        geminiApiKey,
        saveGeminiApiKey,
        getRemainingPrompts,
        canSendAIPrompt,
        incrementAIUsage,
        subscribeToPlan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
