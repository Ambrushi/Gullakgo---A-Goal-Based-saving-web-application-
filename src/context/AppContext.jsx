import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

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
    dailySavingRate: 215,
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
    dailySavingRate: 50,
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
    dailySavingRate: 55,
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
    dailySavingRate: 35,
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
    period: 'day',
    promptLimit: 3,
    limitType: 'daily',
    category: 'free',
    badge: 'FREE TIER',
    color: '#6B7280',
    description: '3 AI Coach Prompts per day to test the waters'
  },
  daily: {
    id: 'daily',
    name: 'Daily Pass',
    price: 10,
    period: 'day',
    promptLimit: 10,
    limitType: 'daily',
    category: 'daily',
    badge: 'QUICK ADVICE ⚡',
    color: '#3B82F6',
    valueTag: '₹1.00 / prompt',
    description: '10 AI Coach Prompts per day for quick emergency advice'
  },
  weekly: {
    id: 'weekly',
    name: 'Weekly Saver',
    price: 49,
    period: 'week',
    promptLimit: 100,
    limitType: 'weekly',
    category: 'weekly',
    badge: 'SAVE 50% vs DAILY 🔥',
    color: '#8B5CF6',
    valueTag: '100 Prompts (₹0.49/prompt)',
    description: '100 AI Coach Prompts for the week — 2x more value than Daily!'
  },
  monthly_lite: {
    id: 'monthly_lite',
    name: 'Monthly Saver',
    price: 99,
    period: 'month',
    promptLimit: 250,
    limitType: 'monthly',
    category: 'monthly',
    badge: 'SAVE 60% 💡',
    color: '#10B981',
    valueTag: '250 Prompts (₹0.39/prompt)',
    description: '250 Prompts per month for consistent budget guidance'
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 149,
    period: 'month',
    promptLimit: 500,
    limitType: 'monthly',
    category: 'monthly',
    badge: 'BEST VALUE 🏆 (3.5x CHEAPER)',
    color: '#EC4899',
    valueTag: '500 Prompts (₹0.29/prompt)',
    description: '500 Prompts per month + AI Spending Audit & Parent Reports'
  },
  monthly_max: {
    id: 'monthly_max',
    name: 'Monthly Max',
    price: 249,
    period: 'month',
    promptLimit: 1000,
    limitType: 'monthly',
    category: 'monthly',
    badge: 'MAX POWER 🚀',
    color: '#F59E0B',
    valueTag: '1,000 Prompts (₹0.25/prompt)',
    description: '1,000 Prompts per month — maximum savings & unlimited freedom'
  }
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('gullak_token') || !!localStorage.getItem('gullak_user');
  });
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('gullak_theme') || 'light';
  }); // 'light' | 'dark'

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gullak_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_default',
      name: 'Aarav Sharma',
      handle: '@aarav_saver',
      avatar: '⚡',
      level: 'Savings Champion 🏆',
      totalSaved: 41949,
      globalStreak: 8,
      parentLinked: true,
      parentName: 'Rajesh Sharma (Dad)',
      parentEmail: 'rajesh.sharma@example.com'
    };
  });

  const [bankAccount, setBankAccount] = useState(() => {
    const saved = localStorage.getItem('gullak_bank_account');
    return saved ? JSON.parse(saved) : {
      upiId: 'aarav@okaxis',
      bankName: 'HDFC Bank',
      accountNumber: '••••••••4892',
      ifscCode: 'HDFC0001234',
      accountHolder: 'Aarav Sharma'
    };
  });

  const [paymentHistory, setPaymentHistory] = useState(() => {
    const saved = localStorage.getItem('gullak_payment_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'tx_101',
        utr: 'UPI/628491038472',
        date: '2026-08-01',
        type: 'Subscription',
        description: 'Weekly Saver Plan Upgrade',
        amount: 49,
        status: 'SUCCESS',
        app: 'Google Pay'
      },
      {
        id: 'tx_102',
        utr: 'UPI/628491039821',
        date: '2026-08-02',
        type: 'Goal Deposit',
        description: 'PlayStation 5 Gullak Deposit',
        amount: 2000,
        status: 'SUCCESS',
        app: 'PhonePe'
      }
    ];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('gullak_goals');
    let loaded = initialGoals;
    if (saved) {
      try { loaded = JSON.parse(saved); } catch (e) { console.error('Failed to parse gullak_goals', e); }
    }
    return loaded.map(g => {
      const contribTotal = (g.contributions && Array.isArray(g.contributions) && g.contributions.length > 0)
        ? g.contributions.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0)
        : (parseFloat(g.currentAmount) || 0);
      return {
        ...g,
        currentAmount: Math.max(parseFloat(g.currentAmount) || 0, contribTotal)
      };
    });
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('gullak_expenses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Failed to parse gullak_expenses', e); }
    }
    return initialExpenses;
  });

  // Save goals & expenses to localStorage on change
  useEffect(() => {
    localStorage.setItem('gullak_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('gullak_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Subscription & AI Prompt Usage State
  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem('gullak_subscription');
    return saved ? JSON.parse(saved) : { planId: 'free', expiryDate: null };
  });

  // Auto-check subscription plan expiration on client
  useEffect(() => {
    if (subscription?.expiryDate && subscription.planId !== 'free') {
      const expiryTime = new Date(subscription.expiryDate).getTime();
      if (Date.now() > expiryTime) {
        console.log('⏳ Client plan expired. Reverting to Free Tier.');
        const expiredSub = { planId: 'free', expiryDate: null };
        setSubscription(expiredSub);
        localStorage.setItem('gullak_subscription', JSON.stringify(expiredSub));
      }
    }
  }, [subscription]);

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

  // Sync data with Axios API on mount or user change
  useEffect(() => {
    const fetchRemoteData = async () => {
      try {
        if (!user?.id || user.id === 'usr_default') return;
        const [remoteGoals, remoteExpenses, remotePayments, remoteSub] = await Promise.allSettled([
          api.getGoals(user.id),
          api.getExpenses(user.id),
          api.getPayments(user.id),
          api.getSubscription(user.id)
        ]);

        if (remoteGoals.status === 'fulfilled' && Array.isArray(remoteGoals.value) && remoteGoals.value.length > 0) {
          setGoals(remoteGoals.value);
        }
        if (remoteExpenses.status === 'fulfilled' && Array.isArray(remoteExpenses.value) && remoteExpenses.value.length > 0) {
          setExpenses(remoteExpenses.value);
        }
        if (remotePayments.status === 'fulfilled' && Array.isArray(remotePayments.value)) {
          setPaymentHistory(remotePayments.value);
        }
        if (remoteSub.status === 'fulfilled' && remoteSub.value?.planId) {
          setSubscription({
            planId: remoteSub.value.planId,
            expiryDate: remoteSub.value.expiryDate || null
          });
        }
      } catch (err) {
        console.warn('⚠️ Server sync notice (Using local fallback):', err);
      }
    };

    fetchRemoteData();
  }, [user?.id]);

  // Apply dark mode class to html element & save to localStorage
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('gullak_theme', themeMode);
  }, [themeMode]);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('gullak_registered_users');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'usr_default',
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

  const saveGeminiApiKey = (key) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('gullak_gemini_api_key', key);
  };

  const currentPlan = SUBSCRIPTION_PLANS[subscription.planId] || SUBSCRIPTION_PLANS.free;

  const getRemainingPrompts = () => {
    const today = getTodayStr();
    const isDailyPlan = currentPlan.limitType === 'daily';
    const currentCount = (isDailyPlan && aiUsage.lastResetDate !== today) ? 0 : aiUsage.count;
    const limit = currentPlan.promptLimit || 3;
    const remaining = Math.max(0, limit - currentCount);
    return {
      count: currentCount,
      limit,
      remaining,
      plan: currentPlan,
      limitUnit: isDailyPlan ? 'day' : currentPlan.period
    };
  };

  const getSubscriptionExpiryStatus = () => {
    if (!subscription?.expiryDate || subscription.planId === 'free') {
      return { isExpiringSoon: false, hoursRemaining: 0, planName: currentPlan.name || '' };
    }
    const expiryTime = new Date(subscription.expiryDate).getTime();
    const nowTime = Date.now();
    const diffMs = expiryTime - nowTime;
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;

    if (diffMs > 0 && diffMs <= twentyFourHoursMs) {
      return {
        isExpiringSoon: true,
        hoursRemaining: Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60))),
        planName: currentPlan.name || 'Pro Pass',
        expiryDateStr: new Date(subscription.expiryDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    }

    return { isExpiringSoon: false, hoursRemaining: 0, planName: currentPlan.name || '' };
  };

  const canSendAIPrompt = () => {
    const { remaining } = getRemainingPrompts();
    return remaining > 0;
  };

  const incrementAIUsage = async () => {
    const today = getTodayStr();
    const isDailyPlan = currentPlan.limitType === 'daily';

    setAiUsage(prev => {
      const baseCount = (isDailyPlan && prev.lastResetDate !== today) ? 0 : prev.count;
      const updated = { count: baseCount + 1, lastResetDate: today };
      localStorage.setItem('gullak_ai_usage', JSON.stringify(updated));
      return updated;
    });

    try {
      if (user?.id) {
        await api.incrementAIUsage(user.id);
      }
    } catch (err) {
      console.warn('⚠️ AI usage API notice:', err.message);
    }
  };

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const signUp = async ({ name, mobile, email, password }) => {
    try {
      const response = await api.signup({ name, mobile, email, password });
      if (response && response.user) {
        if (response.token) {
          localStorage.setItem('gullak_token', response.token);
        }
        localStorage.setItem('gullak_user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.warn('⚠️ Signup fallback to local registration:', error.message);
      return { success: false, message: error.message || 'Failed to create account' };
    }

    // Local Fallback if server is unreachable
    const existing = registeredUsers.find(u => u.mobile === mobile);
    if (existing) {
      return { success: false, message: 'This mobile number is already registered!' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
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

    localStorage.setItem('gullak_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true, message: 'Account created locally!' };
  };

  const loginWithMobile = async ({ mobile, password }) => {
    try {
      const response = await api.login({ mobile, password });
      if (response && response.user) {
        if (response.token) {
          localStorage.setItem('gullak_token', response.token);
        }
        localStorage.setItem('gullak_user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.warn('⚠️ Login fallback to local validation:', error.message);
      return { success: false, message: error.message || 'Invalid Mobile Number or Password' };
    }

    const foundUser = registeredUsers.find(
      u => u.mobile === mobile && u.password === password
    );

    if (foundUser) {
      localStorage.setItem('gullak_user', JSON.stringify(foundUser));
      setUser(foundUser);
      setIsAuthenticated(true);
      return { success: true, message: 'Signed in locally!' };
    }

    return { success: false, message: 'Invalid Mobile Number or Password' };
  };

  const login = (nameStr) => {
    if (nameStr) {
      setUser(prev => {
        const updated = {
          ...prev,
          name: nameStr,
          handle: `@${nameStr.toLowerCase().replace(/\s+/g, '_')}`
        };
        localStorage.setItem('gullak_user', JSON.stringify(updated));
        return updated;
      });
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('gullak_token');
    localStorage.removeItem('gullak_user');
    setIsAuthenticated(false);
    setUser({
      id: 'usr_default',
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
  };

  const completeOnboarding = (userData) => {
    if (userData) {
      setUser(prev => ({ ...prev, ...userData }));
    }
    setIsAuthenticated(true);
  };

  const calculateDailySavingRate = (targetAmount, currentAmount = 0, targetDateStr) => {
    if (!targetAmount || !targetDateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const needed = Math.max(0, parseFloat(targetAmount) - parseFloat(currentAmount));
    return Math.ceil(needed / diffDays);
  };

  const addGoal = async (newGoal) => {
    const goalId = newGoal.id || ('g_' + Date.now());
    const calculatedRate = calculateDailySavingRate(newGoal.targetAmount, 0, newGoal.targetDate);
    const goalWithDefaults = {
      ...newGoal,
      id: goalId,
      userId: user.id || 'usr_default',
      currentAmount: parseFloat(newGoal.currentAmount || 0),
      dailySavingRate: newGoal.dailySavingRate ? parseFloat(newGoal.dailySavingRate) : calculatedRate,
      streak: newGoal.streak || 1,
      status: newGoal.status || 'active',
      contributions: newGoal.contributions || []
    };

    setGoals(prev => [goalWithDefaults, ...prev]);

    try {
      const res = await api.createGoal(goalWithDefaults);
      if (res && res.goal) {
        setGoals(prev => prev.map(g => (String(g.id) === String(goalId) ? { ...g, ...res.goal } : g)));
      }
    } catch (err) {
      console.warn('⚠️ Goal creation API notice (saved locally):', err.message);
    }
  };

  const updateGoal = async (goalId, updatedFields) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (String(goal.id) === String(goalId)) {
          const updated = { ...goal, ...updatedFields };
          const currentAmt = parseFloat(updated.currentAmount) || 0;
          const targetAmt = parseFloat(updated.targetAmount) || 0;
          if (targetAmt > 0 && currentAmt >= targetAmt) {
            updated.status = 'completed';
          } else if (updated.status === 'completed' && targetAmt > 0 && currentAmt < targetAmt) {
            updated.status = 'active';
          }
          return updated;
        }
        return goal;
      })
    );

    try {
      await api.updateGoal(goalId, updatedFields);
    } catch (err) {
      console.warn('⚠️ Goal update API notice:', err.message);
    }
  };

  const deleteGoal = async (goalId) => {
    setGoals(prev => prev.filter(g => String(g.id) !== String(goalId)));
    try {
      await api.deleteGoal(goalId);
    } catch (err) {
      console.warn('⚠️ Goal delete API notice:', err.message);
    }
  };

  const addContribution = async (goalId, amount, note = 'Daily Streak Contribution 🔥') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (String(goal.id) === String(goalId)) {
          const currentAmt = parseFloat(goal.currentAmount) || 0;
          const newCurrent = currentAmt + numAmount;
          const newContribution = {
            id: 'c_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            amount: numAmount,
            note
          };
          const updatedContributions = [newContribution, ...(goal.contributions || [])];
          const isCompleted = newCurrent >= parseFloat(goal.targetAmount);

          return {
            ...goal,
            currentAmount: newCurrent,
            streak: (goal.streak || 0) + 1,
            status: isCompleted ? 'completed' : goal.status,
            contributions: updatedContributions
          };
        }
        return goal;
      })
    );

    setUser(prev => {
      const updatedUser = {
        ...prev,
        totalSaved: (parseFloat(prev.totalSaved) || 0) + numAmount,
        globalStreak: (parseInt(prev.globalStreak) || 0) + 1
      };
      localStorage.setItem('gullak_user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    try {
      const res = await api.addContribution(goalId, { userId: user.id, amount: numAmount, note });
      if (res && res.goal) {
        setGoals(prevGoals =>
          prevGoals.map(g => (String(g.id) === String(goalId) ? { ...g, ...res.goal } : g))
        );
      }
    } catch (err) {
      console.warn('⚠️ Contribution API notice (saved locally):', err.message);
    }
  };

  const addExpense = async (newExpense) => {
    const expenseData = {
      id: 'e_' + Date.now(),
      userId: user.id || 'usr_default',
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date || new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [expenseData, ...prev]);

    try {
      const res = await api.addExpense(expenseData);
      if (res && res.expense) {
        setExpenses(prev => prev.map(e => e.id === expenseData.id ? res.expense : e));
      }
    } catch (err) {
      console.warn('⚠️ Add expense API notice (saved locally):', err.message);
    }
  };

  const toggleParentLink = async (linkedStatus, parentInfo = {}) => {
    const updatedUser = {
      parentLinked: linkedStatus,
      parentName: parentInfo.parentName || user.parentName,
      parentEmail: parentInfo.parentEmail || user.parentEmail
    };

    try {
      if (user.id) {
        await api.updateProfile(user.id, updatedUser);
      }
    } catch (err) {
      console.warn('⚠️ Update profile API notice:', err.message);
    }

    setUser(prev => ({
      ...prev,
      ...updatedUser
    }));
  };

  const deleteExpense = async (expenseId) => {
    try {
      await api.deleteExpense(expenseId);
    } catch (err) {
      console.warn('⚠️ Delete expense API notice:', err.message);
    }
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const updateBankAccountDetails = async (details) => {
    try {
      if (user?.id) {
        await api.updateBankDetails(user.id, details);
      }
    } catch (err) {
      console.warn('⚠️ Bank details update API notice:', err.message);
    }

    setBankAccount(prev => {
      const updated = { ...prev, ...details };
      localStorage.setItem('gullak_bank_account', JSON.stringify(updated));
      return updated;
    });
  };

  const recordPayment = async (tx) => {
    try {
      const res = await api.recordPayment({ userId: user.id, ...tx });
      if (res && res.payment) {
        setPaymentHistory(prev => [res.payment, ...prev]);
        return res.payment;
      }
    } catch (err) {
      console.warn('⚠️ Record payment API notice:', err.message);
    }

    const newTx = {
      id: 'tx_' + Date.now(),
      utr: tx.utr || 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000),
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      ...tx
    };
    setPaymentHistory(prev => {
      const updated = [newTx, ...prev];
      localStorage.setItem('gullak_payment_history', JSON.stringify(updated));
      return updated;
    });
    return newTx;
  };

  const subscribeToPlan = async (planId, paymentApp = 'Google Pay') => {
    const targetPlan = SUBSCRIPTION_PLANS[planId];
    if (!targetPlan) return;

    try {
      if (user?.id) {
        const res = await api.buySubscription(user.id, planId, paymentApp);
        if (res && res.subscription) {
          setSubscription({
            planId: res.subscription.planId,
            expiryDate: res.subscription.expiryDate || null
          });
          if (res.payment) {
            setPaymentHistory(prev => [res.payment, ...prev]);
          }
          // Reset daily usage on upgrade
          const today = getTodayStr();
          const resetUsage = { count: 0, lastResetDate: today };
          setAiUsage(resetUsage);
          localStorage.setItem('gullak_ai_usage', JSON.stringify(resetUsage));
          return res;
        }
      }
    } catch (err) {
      console.warn('⚠️ Buy subscription API notice:', err.message);
    }

    // Local Fallback
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

    // Log local transaction
    if (targetPlan.price > 0) {
      const newTx = {
        id: 'tx_' + Date.now(),
        utr: 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000),
        date: new Date().toISOString().split('T')[0],
        type: 'Subscription',
        description: `${targetPlan.name} Upgrade`,
        amount: targetPlan.price,
        status: 'SUCCESS',
        app: paymentApp
      };
      setPaymentHistory(prev => [newTx, ...prev]);
    }

    const today = getTodayStr();
    const resetUsage = { count: 0, lastResetDate: today };
    setAiUsage(resetUsage);
    localStorage.setItem('gullak_ai_usage', JSON.stringify(resetUsage));
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
        bankAccount,
        paymentHistory,
        updateBankAccountDetails,
        recordPayment,
        addGoal,
        updateGoal,
        deleteGoal,
        calculateDailySavingRate,
        addContribution,
        addExpense,
        deleteExpense,
        toggleParentLink,
        subscription,
        geminiApiKey,
        saveGeminiApiKey,
        getRemainingPrompts,
        getSubscriptionExpiryStatus,
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
