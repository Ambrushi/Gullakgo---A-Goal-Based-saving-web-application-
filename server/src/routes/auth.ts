import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Profile } from '../models/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gullakgo_secure_jwt_token_secret_key_2026';

// Helper to generate JWT token
const generateToken = (userId: string, mobile: string) => {
  return jwt.sign({ id: userId, mobile }, JWT_SECRET, { expiresIn: '7d' });
};

// Signup Endpoint
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !password) {
      res.status(400).json({ error: 'Name, mobile number, and password are required' });
      return;
    }

    const cleanMobile = String(mobile).trim();

    const existing = await Profile.findOne({ where: { mobile: cleanMobile } });
    if (existing) {
      res.status(400).json({ error: 'Mobile number is already registered!' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const userId = 'usr_' + Date.now();
    const handle = `@${name.toLowerCase().replace(/\s+/g, '_')}`;

    const newUser = await Profile.create({
      id: userId,
      name,
      mobile: cleanMobile,
      email: email || '',
      password: hashedPassword,
      handle,
      avatar: '⚡',
      level: 'Rookie Saver 🌟',
      totalSaved: 0.0,
      globalStreak: 1,
      parentLinked: false,
      parentName: '',
      parentEmail: '',
      upiId: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolder: name
    });

    const token = generateToken(newUser.id, newUser.mobile);

    const userJson = newUser.toJSON();
    delete (userJson as any).password;

    res.json({
      success: true,
      message: 'Account created successfully! Welcome to GullakGo 🎉',
      token,
      user: userJson
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Login Endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      res.status(400).json({ error: 'Mobile number and password required' });
      return;
    }

    const cleanMobile = String(mobile).trim();
    console.log(`🔑 Login attempt for mobile: "${cleanMobile}"`);

    const user = await Profile.findOne({ where: { mobile: cleanMobile } });
    if (!user) {
      console.warn(`❌ Login failed: No user found with mobile "${cleanMobile}"`);
      res.status(401).json({ error: 'Invalid Mobile Number or Password' });
      return;
    }

    let isPasswordValid = false;

    if (!user.password) {
      // User was created (e.g. in Supabase UI) without a password. Set password now!
      console.log(`ℹ️ User found but password was null/empty. Setting password for "${cleanMobile}"`);
      const newHashedPassword = await bcryptjs.hash(password, 10);
      await user.update({ password: newHashedPassword });
      isPasswordValid = true;
    } else if (user.password.startsWith('$2')) {
      isPasswordValid = await bcryptjs.compare(password, user.password);
    } else if (user.password === password) {
      isPasswordValid = true;
      const newHashedPassword = await bcryptjs.hash(password, 10);
      await user.update({ password: newHashedPassword });
    }

    if (!isPasswordValid) {
      console.warn(`❌ Login failed: Password mismatch for mobile "${cleanMobile}"`);
      res.status(401).json({ error: 'Invalid Mobile Number or Password' });
      return;
    }

    const token = generateToken(user.id, user.mobile);

    const userJson = user.toJSON();
    delete (userJson as any).password;

    res.json({
      success: true,
      message: 'Signed in successfully! Welcome back 🚀',
      token,
      user: userJson
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update Profile
router.put('/profile/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await Profile.findByPk(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (updateData.password) {
      updateData.password = await bcryptjs.hash(updateData.password, 10);
    }

    await user.update(updateData);

    const userJson = user.toJSON();
    delete (userJson as any).password;

    res.json({ success: true, user: userJson });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update Bank Details Endpoint
router.put('/bank-details/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { upiId, bankName, accountNumber, ifscCode, accountHolder } = req.body;

    const user = await Profile.findByPk(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await user.update({
      upiId: upiId || user.upiId,
      bankName: bankName || user.bankName,
      accountNumber: accountNumber || user.accountNumber,
      ifscCode: ifscCode || user.ifscCode,
      accountHolder: accountHolder || user.accountHolder
    });

    res.json({
      success: true,
      message: 'Bank details updated successfully',
      bankAccount: {
        upiId: user.upiId,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        ifscCode: user.ifscCode,
        accountHolder: user.accountHolder
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
