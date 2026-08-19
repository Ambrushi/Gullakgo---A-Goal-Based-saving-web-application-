import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    mobile: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For open/guest operations, fallback safely or return 401
    res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'gullakgo_secure_jwt_token_secret_key_2026';

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired authentication token.' });
      return;
    }

    req.user = decoded as { id: string; mobile: string };
    next();
  });
};
