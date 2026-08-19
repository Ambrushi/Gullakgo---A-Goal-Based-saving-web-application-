import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

// Axios Instance with Default Settings
export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer Token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gullak_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized Response Error Handling Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'Network error or server is unavailable.';

    if (error.response) {
      customMessage = error.response.data?.error || `Server error (${error.response.status})`;
    } else if (error.request) {
      customMessage = 'Unable to reach backend server. Using local cache.';
    } else {
      customMessage = error.message || 'An unexpected error occurred.';
    }

    console.warn('⚠️ API Request Warning:', customMessage);
    return Promise.reject(new Error(customMessage));
  }
);

// Typed API Service Methods using Axios
export const api = {
  // Auth & Profile
  async signup(userData: { name: string; mobile: string; email?: string; password?: string }) {
    const res = await apiClient.post('/auth/signup', userData);
    return res.data;
  },

  async login(credentials: { mobile: string; password?: string }) {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  async updateProfile(userId: string, data: any) {
    const res = await apiClient.put(`/auth/profile/${userId}`, data);
    return res.data;
  },

  async updateBankDetails(userId: string, bankData: any) {
    const res = await apiClient.put(`/auth/bank-details/${userId}`, bankData);
    return res.data;
  },

  // Goals
  async getGoals(userId?: string) {
    const res = await apiClient.get('/goals', { params: { userId } });
    return res.data;
  },

  async createGoal(goalData: any) {
    const res = await apiClient.post('/goals', goalData);
    return res.data;
  },

  async updateGoal(id: string, goalData: any) {
    const res = await apiClient.put(`/goals/${id}`, goalData);
    return res.data;
  },

  async deleteGoal(id: string) {
    const res = await apiClient.delete(`/goals/${id}`);
    return res.data;
  },

  async addContribution(goalId: string, payload: { userId?: string; amount: number; note?: string }) {
    const res = await apiClient.post(`/goals/${goalId}/contributions`, payload);
    return res.data;
  },

  // Expenses
  async getExpenses(userId?: string) {
    const res = await apiClient.get('/expenses', { params: { userId } });
    return res.data;
  },

  async addExpense(expenseData: any) {
    const res = await apiClient.post('/expenses', expenseData);
    return res.data;
  },

  async deleteExpense(id: string) {
    const res = await apiClient.delete(`/expenses/${id}`);
    return res.data;
  },

  // Payments
  async getPayments(userId?: string) {
    const res = await apiClient.get('/payments', { params: { userId } });
    return res.data;
  },

  async recordPayment(paymentData: any) {
    const res = await apiClient.post('/payments', paymentData);
    return res.data;
  },

  // Subscriptions & AI Usage
  async getSubscription(userId: string) {
    const res = await apiClient.get('/subscription', { params: { userId } });
    return res.data;
  },

  async buySubscription(userId: string, planId: string, paymentApp?: string, utr?: string) {
    const res = await apiClient.post('/subscription/buy', { userId, planId, paymentApp, utr });
    return res.data;
  },

  async upgradeSubscription(userId: string, planId: string) {
    const res = await apiClient.post('/subscription/upgrade', { userId, planId });
    return res.data;
  },

  async incrementAIUsage(userId: string) {
    const res = await apiClient.post('/subscription/ai-usage', { userId });
    return res.data;
  }
};
