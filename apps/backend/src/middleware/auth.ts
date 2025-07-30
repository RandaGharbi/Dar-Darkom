import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Étendre l'interface Request pour inclure la propriété user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Permettre l'accès aux notifications de démonstration
    if (req.path.includes('/user/demo') || req.path.includes('/notifications/user/demo') || 
        (req.path.includes('/notifications') && !authHeader)) {
      req.user = {
        id: 'demo',
        email: 'demo@guerlain.com',
        name: 'Demo User'
      };
      return next();
    }
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token d\'authentification requis' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;
    const userId = typeof decoded === 'object' && decoded.userId ? decoded.userId : null;
    
    if (!userId) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = {
      id: user._id?.toString() || '',
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
}; 