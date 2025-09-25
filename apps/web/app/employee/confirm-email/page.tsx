"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { Loader2 } from 'lucide-react';
import { employeeAPI } from '../../../lib/api';

const ConfirmContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const ConfirmCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
`;

const Header = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  margin: 0 auto 12px auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BrandName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 4px;
`;

const HeaderSubtitle = styled.div`
  font-size: 14px;
  color: #6c757d;
  font-weight: 400;
`;

const Content = styled.div`
  padding: 30px;
`;

const Welcome = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 16px;
  text-align: left;
`;

const Message = styled.div`
  font-size: 16px;
  color: #495057;
  margin-bottom: 30px;
  text-align: left;
  line-height: 1.5;
`;

const CtaContainer = styled.div`
  text-align: center;
  margin: 30px 0;
`;

const ConfirmButton = styled(Link)`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #0056b3;
  }
`;



const WarningBox = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 16px;
  margin: 20px 0;
`;

const WarningIcon = styled.span`
  font-size: 16px;
  margin-right: 8px;
`;

const WarningTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #721c24;
`;

const WarningText = styled.div`
  font-size: 14px;
  color: #721c24;
  margin-top: 8px;
  line-height: 1.4;
`;

const FallbackLink = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 16px;
  margin: 20px 0;
`;

const FallbackText = styled.div`
  font-size: 14px;
  color: #495057;
  margin-bottom: 8px;
`;


const Footer = styled.div`
  background: #f8f9fa;
  padding: 20px 30px;
  text-align: center;
  border-top: 1px solid #dee2e6;
`;

const FooterText = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
`;

const FooterBrand = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 8px;
`;


const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  color: #667eea;
  width: 48px;
  height: 48px;
  margin: 0 auto;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token de confirmation manquant');
        setError('Aucun token de confirmation trouvé dans l\'URL');
        return;
      }

      try {
        const response = await employeeAPI.confirmEmail(token);
        
        if (response.data.success) {
          setStatus('success');
          setMessage('Email confirmé avec succès !');
          setUserName('Utilisateur');
        } else {
          setStatus('error');
          setMessage('Erreur lors de la confirmation');
          setError(response.data.message || 'Erreur inconnue');
        }
      } catch (error: any) {
        console.error('Erreur lors de la confirmation:', error);
        setStatus('error');
        setMessage('Erreur lors de la confirmation');
        setError(error.response?.data?.message || 'Erreur de connexion');
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <ConfirmContainer>
      <ConfirmCard>
        <Header>
          <Logo src="https://lh3.googleusercontent.com/a-/ALV-UjUse46JyqjzRUK0ka2UUw9Kmw7COLpJaxSX6Dlm17b-b2hxIW4=s80-p-k-rw-no" alt="Dar-Darkom Logo" />
          <BrandName>Dar-Darkom</BrandName>
          <HeaderSubtitle>Confirmation d'inscription</HeaderSubtitle>
        </Header>

        <Content>
          {status === 'loading' && (
            <>
              <Welcome>Vérification en cours...</Welcome>
              <Message>
                Nous vérifions votre token de confirmation. Veuillez patienter.
              </Message>
              <CtaContainer>
                <LoadingSpinner />
              </CtaContainer>
            </>
          )}

          {status === 'success' && (
            <>
              <Welcome>✅ Votre compte est confirmé !</Welcome>
              <Message>
                Félicitations ! Votre compte employé <strong>Dar-Darkom</strong> a été activé avec succès. 
                Vous pouvez maintenant vous connecter et commencer à gérer les commandes.
              </Message>
            </>
          )}

          {status === 'error' && (
            <>
              <Welcome>Erreur de confirmation</Welcome>
              <Message>
                Une erreur s'est produite lors de la confirmation de votre email.
              </Message>
              
              {error && (
                <WarningBox>
                  <WarningIcon>!</WarningIcon>
                  <WarningTitle>Détails de l'erreur</WarningTitle>
                  <WarningText>{error}</WarningText>
                </WarningBox>
              )}

              <CtaContainer>
                <ConfirmButton href="/employee/register">
                  Réessayer l'inscription
                </ConfirmButton>
              </CtaContainer>
            </>
          )}

        </Content>

        <Footer>
          <FooterBrand>Dar-Darkom</FooterBrand>
          <FooterText>© 2024 Dar-Darkom - Tous droits réservés</FooterText>
        </Footer>
      </ConfirmCard>
    </ConfirmContainer>
  );
}
