import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import appleSignin from 'apple-signin-auth';
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import path from 'path';
import os from 'os';

// Fonction pour obtenir l'adresse IP de l'ordinateur
const getLocalIPAddress = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
  return 'localhost';
};

// Configurer multer pour stocker les images dans /uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Handler pour l'upload d'image de profil
export const uploadProfileImage = [
  upload.single('profileImage'),
  (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Construire l'URL d'accès à l'image
    // Utiliser BASE_URL si défini, sinon détecter automatiquement l'IP
    let baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      const localIP = getLocalIPAddress();
      baseUrl = `http://${localIP}:5000`;
    }
    
    const imageUrl = `${baseUrl}/uploads/${req.file!.filename}`;
    console.log('Image uploaded with URL:', imageUrl);
    res.json({ url: imageUrl });
  }
];

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, profileImageUrl } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Ici, on force le rôle à 'user' pour toute inscription via l'API
    const user = new User({ name, email, password: hashedPassword, profileImage: profileImageUrl, role: 'user' });
    await user.save();

    // Générer un token JWT pour l'utilisateur nouvellement créé
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Utilise toObject() pour accéder à toutes les propriétés
    const userObj = user.toObject();

    res.status(201).json({
      message: 'User created',
      token,
      user: {
        name: userObj.name,
        email: userObj.email,
        profileImage: userObj.profileImage,
        phoneNumber: userObj.phoneNumber,
        dateOfBirth: userObj.dateOfBirth,
        gender: userObj.gender,
        preferredLanguage: userObj.preferredLanguage,
        username: userObj.username,
        createdAt: userObj.createdAt,
        status: userObj.status
      }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Met à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Utilise toObject() pour accéder à createdAt et lastLogin
    const userObj = user.toObject();

    res.json({
      token,
      user: {
        name: userObj.name,
        email: userObj.email,
        profileImage: userObj.profileImage,
        phoneNumber: userObj.phoneNumber,
        dateOfBirth: userObj.dateOfBirth,
        gender: userObj.gender,
        preferredLanguage: userObj.preferredLanguage,
        username: userObj.username,
        createdAt: userObj.createdAt,
        lastLogin: userObj.lastLogin,
        status: userObj.status
      }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;
    const userId = typeof decoded === 'object' && decoded.userId ? decoded.userId : null;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });
    const user = await User.findById(userId).select('name email profileImage phoneNumber address dateOfBirth gender preferredLanguage username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Déconnexion réussie' });
};

export const appleSignIn = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const appleUser = await appleSignin.verifyIdToken(token, {
      audience: 'com.rindaa.Nourane',
      ignoreExpiration: true,
    });
    let user = await User.findOne({ appleId: appleUser.sub });
    if (!user) {
      user = await User.create({
        appleId: appleUser.sub,
        email: appleUser.email,
        name: appleUser.email?.split('@')[0] || 'AppleUser',
      });
    }
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token: jwtToken, user });
  } catch {
    res.status(401).json({ error: 'Invalid Apple token' });
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  const { token } = req.body;
  const client = new OAuth2Client();
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: 'TON_CLIENT_ID_WEB.apps.googleusercontent.com', // Remplace par ton vrai clientId Google
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: 'Invalid Google token' });

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email?.split('@')[0] || 'GoogleUser',
      });
    }
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token: jwtToken, user });
  } catch {
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

// Nouvelle fonction pour obtenir tous les utilisateurs (sans mot de passe)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password'); // Exclut le champ password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: err });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;
    const userId = typeof decoded === 'object' && decoded.userId ? decoded.userId : null;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });

    const { name, email, phoneNumber, address, dateOfBirth, gender, preferredLanguage, username } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    // Mettre à jour les champs fournis
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
    if (username !== undefined) user.username = username;

    await user.save();

        // Retourner l'utilisateur mis à jour (sans le mot de passe)
    const updatedUser = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = updatedUser;

    res.json({ 
      message: 'User updated successfully', 
      user: userWithoutPassword 
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, address, dateOfBirth, gender, preferredLanguage, username } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    // Mettre à jour les champs fournis
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
    if (username !== undefined) user.username = username;

    await user.save();

    // Retourner l'utilisateur mis à jour (sans le mot de passe)
    const updatedUser = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = updatedUser;

    res.json({ 
      message: 'User updated successfully', 
      user: userWithoutPassword 
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: err });
  }
}; 