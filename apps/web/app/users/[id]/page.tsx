"use client";

import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "../../../lib/api";
import styled from "styled-components";
import { GlobalStyles } from "../../../components/styled/GlobalStyles";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { useState } from 'react';
import Image from "next/image";

const Container = styled.div`
  background: var(--color-white);
  min-height: 100vh;
  padding: 2.5rem 2rem 2rem 2rem;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  @media (max-width: 900px) {
    padding: 2rem 1rem 1rem 1rem;
  }
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
  }
`;

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--color-gray-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--color-taupe);
  overflow: hidden;
  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

const Name = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
`;

const Email = styled.div`
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`;

const Since = styled.div`
  color: #aaa;
  font-size: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2.5rem;
  border-bottom: 1px solid var(--color-gray-light);
  margin-bottom: 2.5rem;
  overflow-x: auto;
  @media (max-width: 600px) {
    gap: 1rem;
    font-size: 13px;
  }
`;

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.active ? 'var(--color-black)' : 'var(--color-taupe)'};
  font-weight: ${props => props.active ? 'bold' : '100'};
  border-bottom: 2.5px solid ${props => props.active ? 'var(--color-black)' : 'transparent'};
  padding: 0.7rem 0;
  cursor: pointer;
  transition: color 0.15s;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 400px;
  width: 100%;
  @media (max-width: 600px) {
    max-width: 100%;
  }
`;

const Label = styled.label`
  margin-bottom: 1rem;
  display: block;
  font-size: 15px;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #E3E0DE;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const UpdateButton = styled.button`
  margin-top: 2.5rem;
  background: #e5d3b3;
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-end;
  &:hover {
    background: #f5a623;
    color: #000;
  }
`;

const DeleteButton = styled.button`
  margin-top: 2.5rem;
  margin-left: 1rem;
  background: #E74C3C;
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-end;
  &:hover {
    background: #c0392b;
    color: var(--color-white);
  }
`;

const FormWrapper = styled.div`  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
`;

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
  const [activeTab, setActiveTab] = useState('Profile');

  if (isLoading || !user) return <div style={{ padding: 40 }}>Chargement...</div>;

  // Ajoute la fonction de suppression (à compléter)
  const handleDeleteProfile = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      // TODO: Appeler l'API de suppression, puis rediriger ou afficher un message
      alert('Suppression du profil (à implémenter)');
    }
  };

  return (
    <>
      <GlobalStyles />
      <DashboardLayout hideSidebar>
        <Container>
 
          <Header>
            <Avatar>
              {user.profileImage ? (
                <Image
                  src={user.profileImage.includes('10.0.2.2') 
                    ? user.profileImage.replace('10.0.2.2', 'localhost')
                    : user.profileImage}
                  alt={user.name}
                  width={90}
                  height={90}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.avatar-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="avatar-fallback" 
                style={{ 
                  display: user.profileImage ? 'none' : 'flex',
                    width: '100%', 
                    height: '100%', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  color: 'var(--color-taupe)',
                  fontWeight: 'bold'
                  }}
              >
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            </Avatar>
            <div>
              <Name>{user.name}</Name>
              <Email>{user.email}</Email>
              <Since>Customer since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</Since>
            </div>
          </Header>
          <Tabs>
            <Tab active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')}>Profile</Tab>
            <Tab active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')}>Orders</Tab>
            <Tab active={activeTab === 'Favorites'} onClick={() => setActiveTab('Favorites')}>Favorites</Tab>
            <Tab active={activeTab === 'Addresses'} onClick={() => setActiveTab('Addresses')}>Addresses</Tab>
            <Tab active={activeTab === 'Payment Methods'} onClick={() => setActiveTab('Payment Methods')}>Payment Methods</Tab>
            <Tab active={activeTab === 'Activity Log'} onClick={() => setActiveTab('Activity Log')}>Activity Log</Tab>
          </Tabs>
          {/* Profile Tab */}
          <SectionTitle>Profile Information</SectionTitle>
          <FormWrapper>
            <Form>
              <div>
                <Label>Full Name</Label>
                <Input type="text" value={user.name || ''} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={user.email || ''} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="text" value={user.phoneNumber || ''} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={user.dateOfBirth || ''} />
              </div>
              <div>
                <Label>Gender</Label>
                <Input type="text" value={user.gender || ''} />
              </div>
              <div>
                <Label>Preferred Language</Label>
                <Input type="text" value={user.preferredLanguage || ''} />
              </div>
            </Form>
            <SectionTitle>Account Settings</SectionTitle>
            <Form>
              <div>
                <Label>Username</Label>
                <Input type="text" value={user.username || ''} />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value="********" />
              </div>
            </Form>
            <ButtonRow>
              <UpdateButton>Update Profile</UpdateButton>
              <DeleteButton onClick={handleDeleteProfile}>Delete Profile</DeleteButton>
            </ButtonRow>
          </FormWrapper>
        </Container>
      </DashboardLayout>
    </>
  );
}

