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
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      profileImage: profileImageUrl, 
      role: 'user' 
    });
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
  console.log('🚀 LOGIN FUNCTION CALLED');
  const { email, password } = req.body;

  console.log('🔐 LOGIN ATTEMPT:', { email, password: '***', timestamp: new Date().toISOString() });

  if (!email || !password) {
    console.log('❌ Missing fields:', { email: !!email, password: !!password });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('🔍 Searching for user with email:', email);
    const user = await User.findOne({ email });
    console.log('👤 User found:', !!user);
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('👤 User details:', {
      name: user.name,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      status: user.status
    });

    // Vérifier si l'utilisateur a un mot de passe (pas d'authentification sociale)
    if (!user.password) {
      console.log('❌ User has no password (social login only)');
      return res.status(401).json({ message: 'Please use social login for this account' });
    }

    console.log('🔐 Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
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
    const user = await User.findById(userId).select('name email profileImage phoneNumber address dateOfBirth gender preferredLanguage username appleId googleId createdAt lastLogin status');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Masquer l'email de relais privé Apple pour l'affichage
    const displayEmail = user.email?.includes('@privaterelay.appleid.com') 
      ? 'Email privé (Apple)' 
      : user.email;
    
    const userResponse = {
      ...user.toObject(),
      displayEmail: displayEmail
    };
    
    console.log('🔍 /me endpoint - User data being returned:', {
      id: user._id,
      name: user.name,
      email: user.email,
      displayEmail: displayEmail,
      phoneNumber: user.phoneNumber,
      address: user.address,
      username: user.username,
      appleId: user.appleId,
      googleId: user.googleId,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      status: user.status
    });
    
    res.json({ user: userResponse });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Déconnexion réussie' });
};

// authController.ts - Version avec récupération de la photo Apple
import axios from 'axios';

// Fonction pour télécharger et sauvegarder la photo de profil Apple
const downloadAppleProfilePhoto = async (appleUserId: string): Promise<string | null> => {
  try {
    // Apple ne fournit pas directement la photo via l'API, mais on peut essayer de la récupérer
    // via l'URL standard de photo de profil Apple
    const photoUrl = `https://appleid.cdn-apple.com/static/bin/cb${appleUserId}/avatar_2x.jpeg`;
    
    // Tester si l'URL existe
    const response = await axios.head(photoUrl, { timeout: 5000 });
    
    if (response.status === 200) {
      console.log('🖼️ Photo Apple trouvée:', photoUrl);
      return photoUrl;
    }
  } catch {
    console.log('🖼️ Pas de photo Apple disponible pour:', appleUserId);
  }
  
  return null;
};

export const appleSignIn = async (req: Request, res: Response) => {
  const { token, fullName, email, photoUrl } = req.body; // Ajouter photoUrl du frontend
  console.log('🍎 Apple Sign In - Données reçues:', {
    token: token ? 'Présent' : 'Manquant',
    fullName,
    email,
    photoUrl: photoUrl ? 'Présent' : 'Absent',
    givenName: fullName?.givenName,
    familyName: fullName?.familyName
  });
  
  try {
    const appleUser = await appleSignin.verifyIdToken(token, {
      ignoreExpiration: true,
      ignoreAudience: true,
    });
    
    console.log('🍎 Token Apple décodé:', {
      sub: appleUser.sub,
      email: appleUser.email,
      email_verified: appleUser.email_verified
    });
    
    let user = await User.findOne({ appleId: appleUser.sub });
    
    if (!user) {
      console.log('🍎 Nouvel utilisateur - Création en cours...');
      
      // ÉTAPE 1: Déterminer le vrai email
      let userEmail = email || appleUser.email;
      if (!userEmail) {
        userEmail = `apple_user_${appleUser.sub.slice(-8)}@temp.com`;
      }
      
      // ÉTAPE 2: Déterminer le vrai nom
      let userName = 'Utilisateur Apple';
      if (fullName && (fullName.givenName || fullName.familyName)) {
        if (fullName.givenName && fullName.familyName) {
          userName = `${fullName.givenName} ${fullName.familyName}`;
        } else if (fullName.givenName) {
          userName = fullName.givenName;
        } else if (fullName.familyName) {
          userName = fullName.familyName;
        }
        console.log('🍎 Nom extrait du fullName:', userName);
      }
      
      // ÉTAPE 3: Récupérer la photo de profil
      let userPhotoUrl = photoUrl; // Photo du frontend en priorité
      
      if (!userPhotoUrl) {
        // Essayer de récupérer la photo Apple
        userPhotoUrl = await downloadAppleProfilePhoto(appleUser.sub);
      }
      
      // Si toujours pas de photo, générer un avatar par défaut plus attrayant
      if (!userPhotoUrl) {
        const initials = [
          fullName?.givenName?.[0] || '',
          fullName?.familyName?.[0] || ''
        ].join('').toUpperCase();
        
        if (initials.length > 0) {
          // Avatar plus stylé avec gradient et icône
          userPhotoUrl = `https://ui-avatars.com/api/?name=${initials}&size=200&background=2E86AB&color=ffffff&format=png&bold=true&rounded=true&font-size=0.6`;
          console.log('🖼️ Avatar stylé généré:', userPhotoUrl);
        }
      }
      
      console.log('🖼️ Photo de profil finale:', userPhotoUrl || 'Aucune');
      
      // Créer l'utilisateur avec les vraies données
      user = await User.create({
        appleId: appleUser.sub,
        email: userEmail,
        name: userName,
        profileImage: userPhotoUrl,
        role: 'user',
        status: 'Active'
      });
      
      console.log('🍎 Utilisateur créé avec:', {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        appleId: user.appleId
      });
      
    } else {
      console.log('🍎 Utilisateur existant trouvé');
      
      let needsUpdate = false;
      
      // Mettre à jour le nom si on a de meilleures données
      if (fullName && (fullName.givenName || fullName.familyName)) {
        let newName = '';
        if (fullName.givenName && fullName.familyName) {
          newName = `${fullName.givenName} ${fullName.familyName}`;
        } else if (fullName.givenName) {
          newName = fullName.givenName;
        } else if (fullName.familyName) {
          newName = fullName.familyName;
        }
        
        if (newName && (
          user.name === 'Utilisateur Apple' ||
          user.name.includes('Utilisateur') ||
          user.name.match(/^[a-z0-9]{6,}$/)
        )) {
          user.name = newName;
          needsUpdate = true;
          console.log('🍎 Nom mis à jour vers:', newName);
        }
      }
      
      // Mettre à jour l'email si on a un meilleur email
      if (email && !email.includes('@privaterelay.appleid.com') && 
          user.email && user.email.includes('@privaterelay.appleid.com')) {
        user.email = email;
        needsUpdate = true;
        console.log('🍎 Email mis à jour vers:', email);
      }
      
      // Mettre à jour la photo si on en a une nouvelle ou meilleure
      if (photoUrl && (!user.profileImage || user.profileImage !== photoUrl)) {
        user.profileImage = photoUrl;
        needsUpdate = true;
        console.log('🖼️ Photo mise à jour vers:', photoUrl);
      } else if (!user.profileImage) {
        // Essayer de récupérer la photo Apple si on n'en a pas
        const applePhotoUrl = await downloadAppleProfilePhoto(appleUser.sub);
        if (applePhotoUrl) {
          user.profileImage = applePhotoUrl;
          needsUpdate = true;
          console.log('🖼️ Photo Apple ajoutée:', applePhotoUrl);
        } else {
          // Générer un avatar par défaut si pas de photo Apple
          const initials = [
            fullName?.givenName?.[0] || '',
            fullName?.familyName?.[0] || ''
          ].join('').toUpperCase();
          
          if (initials.length > 0) {
            const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${initials}&size=200&background=2E86AB&color=ffffff&format=png`;
            user.profileImage = defaultAvatarUrl;
            needsUpdate = true;
            console.log('🖼️ Avatar par défaut ajouté:', defaultAvatarUrl);
          }
        }
      }
      
      if (needsUpdate) {
        await user.save();
        console.log('🍎 Profil utilisateur mis à jour');
      }
    }
    
    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();
    
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );
    
    // Retourner l'utilisateur final
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userObj;
    
    console.log('🍎 Connexion réussie - Données finales:', {
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      profileImage: userWithoutPassword.profileImage,
      hasRealName: !userWithoutPassword.name.includes('Utilisateur'),
      hasRealEmail: !userWithoutPassword.email.includes('@privaterelay.appleid.com'),
      hasPhoto: !!userWithoutPassword.profileImage
    });
    
    res.json({ token: jwtToken, user: userWithoutPassword });
    
  } catch (error) {
    console.error('🍎 Erreur Apple Sign In:', error);
    res.status(401).json({ error: 'Invalid Apple token' });
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  const { token } = req.body;
  const client = new OAuth2Client();
  
  console.log('🔍 Google Sign In - Token reçu:', token ? 'Présent' : 'Manquant');
  console.log('🔍 Google Sign In - Headers:', {
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type'],
    'origin': req.headers['origin'],
    'referer': req.headers['referer']
  });
  console.log('🔍 Google Sign In - Body:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenStart: token ? token.substring(0, 20) + '...' : 'N/A'
  });
  
  try {
    const audience = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
    console.log('🔍 Google Sign In - Audience utilisé:', audience);
    console.log('🔍 Google Sign In - Tentative de vérification du token...');
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: audience,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      console.log('❌ Google Sign In - Payload invalide');
      return res.status(401).json({ error: 'Invalid Google token' });
    }
    
    console.log('✅ Google Sign In - Token vérifié avec succès');

    console.log('🔍 Google Sign In - Payload décodé:', {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture ? 'Présent' : 'Absent',
      email_verified: payload.email_verified
    });

    let user = await User.findOne({ googleId: payload.sub });
    
    if (!user) {
      console.log('🔍 Google Sign In - Nouvel utilisateur, création en cours...');
      
      // Vérifier si un utilisateur avec cet email existe déjà
      if (payload.email) {
        user = await User.findOne({ email: payload.email });
        if (user) {
          // Lier le compte Google à l'utilisateur existant
          user.googleId = payload.sub;
          await user.save();
          console.log('🔗 Google Sign In - Compte Google lié à l\'utilisateur existant');
        }
      }
      
      if (!user) {
        // Déterminer le nom d'utilisateur
        const userName = payload.name || payload.email?.split('@')[0] || 'GoogleUser';
        console.log('👤 Google Sign In - Nom d\'utilisateur:', userName);
        
        // Gérer la photo de profil Google
        let profileImage = null;
        
        if (payload.picture) {
          // Utiliser la vraie photo Google (gratuite)
          profileImage = payload.picture;
          console.log('🖼️ Google Sign In - Photo Google utilisée:', profileImage);
        } else {
          // Générer un avatar par défaut si pas de photo
          const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          if (initials.length > 0) {
            profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=200&background=2E86AB&color=ffffff&format=png&bold=true&rounded=true&font-size=0.6`;
            console.log('🖼️ Google Sign In - Avatar par défaut généré:', profileImage);
          }
        }
        
        // Créer un nouvel utilisateur
        user = await User.create({
          googleId: payload.sub,
          email: payload.email || `google_${payload.sub}@example.com`,
          name: userName,
          profileImage: profileImage,
          role: 'user',
          status: 'Active'
        });
        
        console.log('✅ Google Sign In - Utilisateur créé:', {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          googleId: user.googleId
        });
      }
    } else {
      console.log('🔍 Google Sign In - Utilisateur existant trouvé');
      
      // Mettre à jour la photo si on n'en a pas ou si Google en a une meilleure
      if (!user.profileImage && payload.picture) {
        user.profileImage = payload.picture;
        await user.save();
        console.log('🖼️ Google Sign In - Photo Google ajoutée à l\'utilisateur existant');
      }
    }
    
    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();
    
    const jwtToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    // Retourner l'utilisateur sans le mot de passe
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userObj;
    
    console.log('✅ Google Sign In - Connexion réussie:', {
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      profileImage: userWithoutPassword.profileImage,
      hasRealPhoto: !!userWithoutPassword.profileImage && !userWithoutPassword.profileImage.includes('ui-avatars.com')
    });
    
    res.json({ token: jwtToken, user: userWithoutPassword });
  } catch (error: unknown) {
    console.error('❌ Google Sign In Error:', error);
    
    // Type guard pour vérifier si c'est une Error
    if (error instanceof Error) {
      console.error('❌ Google Sign In Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5) // Premières 5 lignes de la stack
      });
      
      // Log spécifique pour les erreurs OAuth
      if (error.message && error.message.includes('invalid_request')) {
        console.error('🚨 ERREUR OAUTH: invalid_request détectée');
        console.error('🚨 Vérifiez que le Client ID correspond à la plateforme (iOS vs Web)');
      }
    } else {
      console.error('❌ Google Sign In Error (non-Error type):', error);
    }
    
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

    const { name, email, phoneNumber, address, dateOfBirth, gender, preferredLanguage, username, profileImage } = req.body;
    
    console.log('🔄 updateUser - Données reçues:', {
      userId,
      name,
      email,
      phoneNumber,
      address,
      dateOfBirth,
      gender,
      preferredLanguage,
      username,
      profileImage
    });

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    console.log('🔄 updateUser - Utilisateur trouvé:', {
      id: user._id,
      name: user.name,
      email: user.email,
      currentProfileImage: user.profileImage
    });

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
    if (profileImage !== undefined) {
      console.log('🖼️ updateUser - Mise à jour de la photo de profil:', {
        anciennePhoto: user.profileImage,
        nouvellePhoto: profileImage
      });
      user.profileImage = profileImage;
    }

    await user.save();
    
    console.log('✅ updateUser - Utilisateur sauvegardé avec succès:', {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    });

        // Retourner l'utilisateur mis à jour (sans le mot de passe)
    const updatedUser = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = updatedUser;

    console.log('📤 updateUser - Réponse envoyée:', {
      message: 'User updated successfully',
      userProfileImage: userWithoutPassword.profileImage
    });
    
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