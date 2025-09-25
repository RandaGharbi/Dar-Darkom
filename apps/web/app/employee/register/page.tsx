"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { authAPI, employeeAPI } from '../../../lib/api';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background-image: 
    linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%), 
    url('https://cdn.radancy.eu/company/2619/cms/photos/header-metiers-restauration.jpeg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: #3b82f6;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 8px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #718096;
  margin-bottom: 0;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #2d3748;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background-color: #ffffff;
  }

  &:not(:placeholder-shown) {
    background-color: #f7fafc;
    border-color: #cbd5e0;
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }

  &:focus::placeholder {
    color: #cbd5e0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: white;
  color: #2d3748;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:not([value=""]) {
    background-color: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  text-decoration: none;

  &:hover {
    background: #cbd5e0;
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function EmployeeRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    role: 'EMPLOYE'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await employeeAPI.register({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        // Stocker le token et les données utilisateur
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        toast.success('Compte employé créé avec succès ! Vérifiez votre email pour confirmer votre inscription.');
        
        // Attendre un peu avant de rediriger pour que l'utilisateur voie le message
        setTimeout(() => {
          router.push('/employee/dashboard');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Erreur lors de la création du compte');
      }
    } catch (error: any) {
      console.error('Erreur lors de la création du compte:', error);
      toast.error(
        error.response?.data?.message || 
        'Erreur lors de la création du compte'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Link href="/login">
          <BackButton>
            <ArrowLeft size={16} />
            Retour à la connexion
          </BackButton>
        </Link>

        <Header>
          <Logo>🏢</Logo>
          <Title>Inscription Employé</Title>
          <Subtitle>Créez votre compte employé</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">
              <User size={16} />
              Nom complet
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">
              <Mail size={16} />
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@exemple.com"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="phoneNumber">
              <Phone size={16} />
              Téléphone
            </Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+216 XX XXX XXX"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="address">
              <MapPin size={16} />
              Adresse
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Votre adresse"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="role">
              <Building size={16} />
              Rôle
            </Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="EMPLOYE">Employé</option>
              <option value="LIVREUR">Livreur</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">
              <Lock size={16} />
              Mot de passe
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 caractères"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">
              <Lock size={16} />
              Confirmer le mot de passe
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Répétez votre mot de passe"
              required
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size={20} />
                Création en cours...
              </>
            ) : (
              'Créer le compte'
            )}
          </Button>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
}
