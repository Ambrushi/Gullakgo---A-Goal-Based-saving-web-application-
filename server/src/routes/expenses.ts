import { Router, Request, Response } from 'express';
import { Expense } from '../models/index.js';

const router = Router();

// Get expenses
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;

    const expenses = await Expense.findAll({
      where: whereClause,
      order: [['date', 'DESC']]
    });

    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Create expense
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, title, amount, category, icon, date } = req.body;

    const newExpense = await Expense.create({
      id: 'e_' + Date.now(),
      userId: userId || 'usr_default',
      title,
      amount: parseFloat(amount),
      category,
      icon: icon || 'bi-receipt',
      date: date || new Date().toISOString().split('T')[0]
    });

    res.json({ success: true, expense: newExpense });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (expense) {
      await expense.destroy();
    }
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
