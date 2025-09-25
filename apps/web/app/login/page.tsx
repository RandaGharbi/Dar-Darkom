'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../lib/api';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';
import { GlobalStyles } from '../../components/styled/GlobalStyles';
import { isAuthenticated, setToken } from '../../utils/auth';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const BackgroundGallery = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const BackgroundImage = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  transition: opacity 3s ease-in-out;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(220, 38, 38, 0.3) 0%,
      rgba(59, 130, 246, 0.2) 50%,
      rgba(34, 197, 94, 0.2) 100%
    );
    z-index: 2;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 50%);
  z-index: 3;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  background: #ffffff;
  border: 1px solid ${({ $hasError }) => $hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 12px;
  font-size: 16px;
  padding: 14px 16px 14px 48px;
  color: #1f2937;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #6b7280;
    background: #f3f4f6;
  }
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  padding: 14px 20px;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const TunisiaPattern = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #dc2626, #3b82f6);
  border-radius: 50%;
  opacity: 0.1;
  z-index: 0;
`;

const TunisiaPattern2 = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #22c55e, #dc2626);
  border-radius: 50%;
  opacity: 0.1;
  z-index: 0;
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const EmployeeButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  padding: 12px 20px;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  width: 100%;

  &:hover {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #9ca3af;
  font-size: 14px;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
  
  &::before {
    margin-right: 16px;
  }
  
  &::after {
    margin-left: 16px;
  }
`;

// Images de la Tunisie
const tunisiaImages = [
  {
    src: 'https://olovetunisia.com/cdn/shop/articles/sidi_bous_said_tunisia_1600x.jpg?v=1665796742',
    alt: 'Sidi Bou Saïd, Tunisie'
  },
  {
    src: 'https://static1.evcdn.net/cdn-cgi/image/width=3840,height=3072,quality=70,fit=crop/offer/raw/2022/10/25/f9ea02f4-5342-4fd1-98be-aafdd0b56e5c.jpg',
    alt: 'Carthage, Tunisie'
  },
  {
    src: 'https://lapresse.tn/wp-content/uploads/2025/06/tunisie-850x491.jpg',
    alt: 'Tunis, Tunisie'
  },
  {
    src: 'https://www.tourmag.com/photo/art/grande/73793205-51335561.jpg?v=1688138566',
    alt: 'Djerba, Tunisie'
  },
  {
    src: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/5c/67/caption.jpg?w=1200&h=1200&s=1',
    alt: 'Douz, Tunisie'
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isEmployeeMode, setIsEmployeeMode] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté une seule fois
  useEffect(() => {
    const checkAuth = () => {
      console.log('Checking authentication...');
      const authenticated = isAuthenticated();
      console.log('Is authenticated:', authenticated);
      
      // Vérifier si on est en mode employé via l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const fromLogout = urlParams.get('fromLogout');
      
      if (mode === 'employee') {
        setIsEmployeeMode(true);
      }
      
      // Si l'utilisateur vient d'une déconnexion, ne pas rediriger automatiquement
      if (fromLogout === 'true') {
        console.log('User came from logout, showing login form');
        setIsChecking(false);
        return;
      }
      
      if (authenticated) {
        console.log('User is authenticated, checking role for redirection');
        setIsRedirecting(true);
        
        // Vérifier le rôle dans le token pour la redirection
        setTimeout(() => {
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('🔐 Rôle trouvé dans le token (auth check):', payload.role);
              
              if (payload.role === 'EMPLOYE') {
                window.location.href = '/employee/dashboard';
              } else if (payload.role === 'ADMIN') {
                window.location.href = '/';
              } else {
                window.location.href = '/';
              }
            } else {
              window.location.href = '/';
            }
          } catch (e) {
            console.error('❌ Erreur lors de la vérification du rôle (auth check):', e);
            window.location.href = '/';
          }
        }, 100);
      } else {
        console.log('User is not authenticated, showing login form');
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isEmployeeMode]);

  // Carrousel d'images automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % tunisiaImages.length
      );
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      console.log('🔐 LOGIN ATTEMPT:', { 
        email, 
        password: '***', 
        isEmployeeMode,
        timestamp: new Date().toISOString() 
      });
      console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
      return authAPI.login(email, password);
    },
    onSuccess: (response) => {
      console.log('✅ LOGIN SUCCESS:', {
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString()
      });
      const { token, user } = response.data;
      
      try {
        // Vérifier le rôle de l'utilisateur
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role || user?.role;
        
        console.log('🔍 User role:', userRole, 'Employee mode:', isEmployeeMode);
        
        // Vérifier la correspondance entre le mode et le rôle
        if (isEmployeeMode && userRole !== 'EMPLOYE') {
          toast.error('Accès refusé. Rôle employé requis pour cet espace.');
          return;
        }
        
        if (!isEmployeeMode && userRole === 'EMPLOYE') {
          toast.error('Veuillez utiliser l\'espace employé pour vous connecter.');
          return;
        }
        
        setToken(token);
        console.log('💾 Token set successfully:', token ? 'Token present' : 'No token');
        toast.success('Connexion réussie !');
        
        // Marquer comme en cours de redirection
        setIsRedirecting(true);
        console.log('🚀 Redirecting immediately...');
        
        // Rediriger selon le rôle dans le token
        setTimeout(() => {
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('🔐 Rôle trouvé dans le token:', payload.role);
              
              if (payload.role === 'EMPLOYE') {
                window.location.href = '/employee/dashboard';
              } else if (payload.role === 'ADMIN') {
                window.location.href = '/';
              } else {
                window.location.href = '/';
              }
            } else {
              window.location.href = '/';
            }
          } catch (e) {
            console.error('❌ Erreur lors de la vérification du rôle:', e);
            window.location.href = '/';
          }
        }, 100);
        
      } catch (error) {
        console.error('💥 Error during login process:', error);
        toast.error('Erreur lors de la connexion');
        setIsRedirecting(false);
      }
    },
    onError: (error: unknown) => {
      console.error('❌ LOGIN ERROR:', {
        error,
        timestamp: new Date().toISOString(),
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      const err = error as { 
        response?: { 
          status?: number;
          data?: { message?: string } 
        };
        message?: string;
      };
      
      console.error('🔍 Error details:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        fullError: err
      });
      
      toast.error(err.response?.data?.message || err.message || 'Erreur de connexion');
      setEmailError(true);
      setPasswordError(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted');
    
    // Empêcher la soumission si déjà en cours
    if (loginMutation.isPending) {
      console.log('⏳ Login already in progress, ignoring submission');
      return;
    }
    
    // Reset errors
    setEmailError(false);
    setPasswordError(false);
    
    if (!email || !password) {
      console.log('❌ Missing fields:', { email: !!email, password: !!password });
      toast.error('Veuillez remplir tous les champs');
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }
    
    console.log('🚀 Starting login mutation...');
    loginMutation.mutate({ email, password });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(false);
  };

  // Afficher un loader pendant la vérification d'authentification ou la redirection
  if (isChecking || isRedirecting) {
    return (
      <>
        <GlobalStyles />
        <Container>
          <LoginBox>
            <Header>
              <Title>DarDarkom</Title>
              <Subtitle>Administration Dashboard</Subtitle>
            </Header>
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#6b7280',
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <LoadingSpinner size={20} />
              {isRedirecting ? 'Redirection en cours...' : 'Chargement...'}
            </div>
          </LoginBox>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Container>
        <BackgroundGallery>
          {tunisiaImages.map((image, index) => (
            <BackgroundImage key={index} $isActive={index === currentImageIndex}>
              <ImageWrapper>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                />
              </ImageWrapper>
            </BackgroundImage>
          ))}
          <Overlay />
        </BackgroundGallery>
        
        <TunisiaPattern />
        <TunisiaPattern2 />
        <LoginBox>
          <Header>
            <Title>DarDarkom</Title>
            <Subtitle>
              {isEmployeeMode ? 'Espace Employé' : 'Administration Dashboard'}
              <span>🇹🇳</span>
            </Subtitle>
            {isEmployeeMode && (
              <p style={{ 
                color: '#6b7280', 
                fontSize: '14px', 
                margin: '8px 0 0 0',
                fontStyle: 'italic'
              }}>
                Connectez-vous pour gérer les commandes
              </p>
            )}
          </Header>
          
          <Form onSubmit={handleSubmit} noValidate>
            <InputGroup>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <Input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={handleEmailChange}
                $hasError={emailError}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={handlePasswordChange}
                $hasError={passwordError}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputGroup>
            
            <Button 
              type="submit" 
              disabled={loginMutation.isPending || !email || !password || isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <LoadingSpinner size={20} />
                  Redirection...
                </>
              ) : loginMutation.isPending ? (
                <>
                  <LoadingSpinner size={20} />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
            
            <Divider>ou</Divider>
            
            <EmployeeButton 
              type="button"
              onClick={() => setIsEmployeeMode(!isEmployeeMode)}
            >
              {isEmployeeMode ? '👑 Mode Admin' : '🏢 Espace Employé'}
            </EmployeeButton>
            
            {isEmployeeMode && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '16px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Pas encore de compte ?{' '}
                <Link 
                  href="/employee/register" 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Créer un compte employé
                </Link>
              </div>
            )}
          </Form>
        </LoginBox>
      </Container>
    </>
  );
} 