import { Router, Request, Response } from 'express';
import { Subscription, PaymentHistory } from '../models/index.js';

const router = Router();

const PLAN_DETAILS: Record<string, { name: string; price: number; promptLimit: number; limitType: 'daily' | 'weekly' | 'monthly'; period: string; badge: string; description: string }> = {
  free: { name: 'Free Teen Starter', price: 0, promptLimit: 3, limitType: 'daily', period: 'day', badge: 'FREE TIER', description: '3 AI Coach Prompts per day to test the waters' },
  daily: { name: 'Daily Pass', price: 10, promptLimit: 10, limitType: 'daily', period: 'day', badge: 'QUICK ADVICE ⚡', description: '10 AI Coach Prompts per day for quick emergency advice' },
  weekly: { name: 'Weekly Saver', price: 49, promptLimit: 100, limitType: 'weekly', period: 'week', badge: 'SAVE 50% vs DAILY 🔥', description: '100 AI Coach Prompts for the week — 2x more value than Daily!' },
  monthly_lite: { name: 'Monthly Saver', price: 99, promptLimit: 250, limitType: 'monthly', period: 'month', badge: 'SAVE 60% 💡', description: '250 Prompts per month for consistent budget guidance' },
  monthly: { name: 'Monthly Pro', price: 149, promptLimit: 500, limitType: 'monthly', period: 'month', badge: 'BEST VALUE 🏆 (3.5x CHEAPER)', description: '500 Prompts per month + AI Spending Audit & Parent Reports' },
  monthly_max: { name: 'Monthly Max', price: 249, promptLimit: 1000, limitType: 'monthly', period: 'month', badge: 'MAX POWER 🚀', description: '1,000 Prompts per month — maximum savings & unlimited freedom' }
};

// Helper: Check if subscription has expired
const checkAndGetActiveSubscription = async (userId: string) => {
  let sub = await Subscription.findOne({ where: { userId } });
  const today = new Date().toISOString().split('T')[0];

  if (!sub) {
    sub = await Subscription.create({
      id: 'sub_' + Date.now(),
      userId,
      planId: 'free',
      expiryDate: null,
      dailyUsageCount: 0,
      lastResetDate: today
    });
    return sub;
  }

  // Check if subscription has expired
  if (sub.expiryDate) {
    const expiryTime = new Date(sub.expiryDate).getTime();
    const nowTime = new Date().getTime();

    if (nowTime > expiryTime && sub.planId !== 'free') {
      console.log(`⏳ Subscription for user ${userId} expired (${sub.planId}). Reverting to free tier.`);
      await sub.update({
        planId: 'free',
        expiryDate: null,
        dailyUsageCount: 0,
        lastResetDate: today
      });
    }
  }

  return sub;
};

// Get subscription status (with auto-expiry check)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.json({ planId: 'free', dailyUsageCount: 0, activePlan: PLAN_DETAILS.free });
      return;
    }

    const sub = await checkAndGetActiveSubscription(userId as string);
    const activePlan = PLAN_DETAILS[sub.planId] || PLAN_DETAILS.free;

    let isExpiringSoon = false;
    let hoursRemaining = 0;

    if (sub.expiryDate && sub.planId !== 'free') {
      const expiryTime = new Date(sub.expiryDate).getTime();
      const nowTime = Date.now();
      const diffMs = expiryTime - nowTime;
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;

      if (diffMs > 0 && diffMs <= twentyFourHoursMs) {
        isExpiringSoon = true;
        hoursRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
      }
    }

    res.json({
      id: sub.id,
      userId: sub.userId,
      planId: sub.planId,
      expiryDate: sub.expiryDate,
      dailyUsageCount: sub.dailyUsageCount,
      lastResetDate: sub.lastResetDate,
      isExpiringSoon,
      hoursRemaining,
      activePlan
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Buy / Upgrade Subscription Endpoint
router.post('/buy', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, planId, paymentApp, utr } = req.body;

    if (!userId || !planId) {
      res.status(400).json({ error: 'userId and planId are required' });
      return;
    }

    const planInfo = PLAN_DETAILS[planId];
    if (!planInfo) {
      res.status(400).json({ error: 'Invalid subscription plan ID' });
      return;
    }

    // Calculate expiration date based on plan duration
    let expiry: Date | null = new Date();
    if (planId === 'daily') expiry.setDate(expiry.getDate() + 1); // +24 hours
    else if (planId === 'weekly') expiry.setDate(expiry.getDate() + 7); // +7 days
    else if (planId.startsWith('monthly')) expiry.setDate(expiry.getDate() + 30); // +30 days
    else expiry = null;

    const today = new Date().toISOString().split('T')[0];
    const generatedUtr = utr || 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000);

    // 1. Record transaction log in PaymentHistory table
    let newPayment = null;
    if (planInfo.price > 0) {
      newPayment = await PaymentHistory.create({
        id: 'tx_' + Date.now(),
        userId,
        utr: generatedUtr,
        type: 'Subscription',
        description: `${planInfo.name} Upgrade`,
        amount: planInfo.price,
        status: 'SUCCESS',
        app: paymentApp || 'UPI',
        date: today
      });
    }

    // 2. Activate Subscription in Database
    let sub = await Subscription.findOne({ where: { userId } });
    if (!sub) {
      sub = await Subscription.create({
        id: 'sub_' + Date.now(),
        userId,
        planId,
        expiryDate: expiry ? expiry.toISOString() : null,
        dailyUsageCount: 0,
        lastResetDate: today
      });
    } else {
      await sub.update({
        planId,
        expiryDate: expiry ? expiry.toISOString() : null,
        dailyUsageCount: 0, // Reset usage counter on new subscription activation
        lastResetDate: today
      });
    }

    res.json({
      success: true,
      message: `${planInfo.name} activated successfully! 🎉`,
      subscription: {
        ...sub.toJSON(),
        activePlan: planInfo
      },
      payment: newPayment
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Track & increment AI Coach prompt usage count
router.post('/ai-usage', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const sub = await checkAndGetActiveSubscription(userId);
    const activePlan = PLAN_DETAILS[sub.planId] || PLAN_DETAILS.free;

    const isDailyPlan = activePlan.limitType === 'daily';
    const isNewDay = sub.lastResetDate !== today;
    const currentUsage = (isDailyPlan && isNewDay) ? 0 : sub.dailyUsageCount;

    if (currentUsage >= activePlan.promptLimit) {
      res.status(403).json({
        error: `Prompt limit of ${activePlan.promptLimit} reached for ${activePlan.name} (${activePlan.period}). Please upgrade your plan.`,
        subscription: {
          ...sub.toJSON(),
          activePlan
        }
      });
      return;
    }

    const newCount = currentUsage + 1;

    await sub.update({
      dailyUsageCount: newCount,
      lastResetDate: today
    });

    res.json({ success: true, subscription: { ...sub.toJSON(), activePlan } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
