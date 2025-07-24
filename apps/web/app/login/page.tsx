'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../lib/api';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';
import { GlobalStyles } from '../../components/styled/GlobalStyles';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #ffffff;
`;

const LoginBox = styled.div`
  margin-top: 60px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background: var(--input-bg);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  padding: 0.9rem 1rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.03);

  &::placeholder {
    color: #bfae99;
    opacity: 1;
  }
`;

const Button = styled.button`
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  padding: 0.9rem 0;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled.a`
  display: block;
  text-align: right;
  margin-top: 0.5rem;
  color: var(--link-color);
  font-size: 0.95em;
  text-decoration: underline;
  cursor: pointer;
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Supprime le token à chaque fois qu'on arrive sur /login
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: (response) => {
      const { token } = response.data;
      localStorage.setItem('token', token);
      toast.success('Connexion réussie !');
      router.push('/');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <LoginBox>
          <Title>Welcome back</Title>
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Connexion...' : 'Log in'}
            </Button>
          </Form>
          <ForgotPassword href="#">Forgot password?</ForgotPassword>
        </LoginBox>
      </Container>
    </>
  );
} 