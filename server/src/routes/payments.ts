import { Router, Request, Response } from 'express';
import { PaymentHistory } from '../models/index.js';

const router = Router();

// Get payment history
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;

    const payments = await PaymentHistory.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Record new payment
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, utr, type, description, amount, status, app } = req.body;

    const generatedUtr = utr || 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000);

    const newPayment = await PaymentHistory.create({
      id: 'tx_' + Date.now(),
      userId: userId || 'default_user',
      utr: generatedUtr,
      type: type || 'Subscription',
      description: description || 'Payment Deposit',
      amount: parseFloat(amount),
      status: status || 'SUCCESS',
      app: app || 'UPI',
      date: new Date().toISOString().split('T')[0]
    });

    res.json({ success: true, payment: newPayment });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
