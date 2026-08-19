import { Router, Request, Response } from 'express';
import { Goal, Contribution, Profile } from '../models/index.js';

const router = Router();

// Get goals for user
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;

    const goals = await Goal.findAll({
      where: whereClause,
      include: [{ model: Contribution, as: 'contributions' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(goals);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Create goal
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      userId,
      title,
      category,
      icon,
      targetAmount,
      targetDate,
      dailySavingRate,
      lockIn
    } = req.body;

    const goalId = id || ('g_' + Date.now());

    const newGoal = await Goal.create({
      id: goalId,
      userId: userId || 'usr_default',
      title,
      category,
      icon: icon || 'bi-piggy-bank',
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0.0,
      targetDate,
      dailySavingRate: parseFloat(dailySavingRate || 0),
      streak: 1,
      lockIn: Boolean(lockIn),
      status: 'active'
    });

    res.json({ success: true, goal: { ...newGoal.toJSON(), contributions: [] } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update goal
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const goal = await Goal.findByPk(id);
    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    await goal.update(updateData);
    res.json({ success: true, goal });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Delete goal
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByPk(id);
    if (goal) {
      await goal.destroy();
    }

    res.json({ success: true, message: 'Goal deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Add contribution deposit to goal
router.post('/:id/contributions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, amount, note } = req.body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ error: 'Valid amount is required' });
      return;
    }

    const goal = await Goal.findByPk(id);
    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    // Create contribution
    await Contribution.create({
      id: 'c_' + Date.now(),
      goalId: id,
      userId: userId || goal.userId,
      amount: numAmount,
      note: note || 'Daily Streak Contribution 🔥',
      date: new Date().toISOString().split('T')[0]
    });

    // Re-calculate total from all contributions in DB
    const allDbContributions = await Contribution.findAll({ where: { goalId: id } });
    const totalSavedInDb = allDbContributions.reduce((sum, c) => sum + (parseFloat(c.amount as any) || 0), 0);
    const isCompleted = totalSavedInDb >= goal.targetAmount;
    const newStreak = (goal.streak || 0) + 1;

    // Update goal state
    await goal.update({
      currentAmount: totalSavedInDb,
      streak: newStreak,
      status: isCompleted ? 'completed' : goal.status
    });

    // Update user profile totalSaved & globalStreak
    const targetUserId = userId || goal.userId;
    const profile = await Profile.findByPk(targetUserId);
    if (profile) {
      await profile.update({
        totalSaved: (profile.totalSaved || 0) + numAmount,
        globalStreak: (profile.globalStreak || 0) + 1
      });
    }

    const updatedGoal = await Goal.findByPk(id, {
      include: [{ model: Contribution, as: 'contributions' }]
    });

    res.json({ success: true, goal: updatedGoal });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
