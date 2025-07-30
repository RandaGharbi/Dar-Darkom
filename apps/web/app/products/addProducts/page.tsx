"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import styled from "styled-components";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { toast } from "react-hot-toast";
import { CreateProductData } from "../../../types/product.types";

const PageContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  padding: 40px 0 0 0;
  
  @media (max-width: 1120px) {
    padding: 20px 0 0 0;
  }
  
  @media (max-width: 480px) {
    padding: 16px 0 0 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 8px 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 1120px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.1rem;
  margin-bottom: 32px;
  
  @media (max-width: 1120px) {
    font-size: 1rem;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 24px;
    margin: 10px;
  }
`;

const ResponsiveContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 120px);
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const ResponsiveContent = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CancelBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ConfirmBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    category: '',
    productType: 'product',
    status: 'Active',
    image_url: '',
    product_url: '',
    quantity: 0
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: CreateProductData) => {
      await api.post('/products/addProduct', productData);
    },
    onSuccess: () => {
      setNewProduct({
        name: '',
        title: '',
        description: '',
        price: '',
        category: '',
        productType: 'product',
        status: 'Active',
        image_url: '',
        product_url: '',
        quantity: 0
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit créé avec succès !');
      router.push('/products');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du produit : ' + (error instanceof Error ? error.message : String(error)));
    }
  });

  return (
    <DashboardLayout hideSidebar>
      <PageContainer>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={16} />
            Retour
          </BackButton>
          
          <ResponsiveContainer>
            <ResponsiveContent>
              <Title>Ajouter un nouveau produit</Title>
              <Subtitle>Remplissez les informations pour créer un nouveau produit</Subtitle>

              <FormContainer>
            <FormTitle>Informations du produit</FormTitle>
            
            <FormGroup>
              <Label>Nom *</Label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Nom du produit"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Titre</Label>
              <Input
                value={newProduct.title}
                onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                placeholder="Titre du produit"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Description du produit"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Prix *</Label>
              <Input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </FormGroup>

            <FormGroup>
              <Label>Quantité</Label>
              <Input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                placeholder="0"
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Catégorie *</Label>
              <Select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Face">Face</option>
                <option value="Body">Body</option>
                <option value="Hair">Hair</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Statut</Label>
              <Select
                value={newProduct.status}
                onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
              >
                <option value="Active">Actif</option>
                <option value="Inactive">Inactif</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>URL de l&apos;image</Label>
              <Input
                type="url"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </FormGroup>
            
            <FormFooter>
              <CancelBtn onClick={() => router.back()}>
                Annuler
              </CancelBtn>
              <ConfirmBtn
                onClick={() => {
                  if (!newProduct.name || !newProduct.price || !newProduct.category) {
                    toast.error('Veuillez remplir tous les champs obligatoires');
                    return;
                  }
                  createProductMutation.mutate({
                    ...newProduct,
                    price: parseFloat(newProduct.price)
                  });
                }}
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? 'Création...' : 'Créer le produit'}
              </ConfirmBtn>
            </FormFooter>
                        </FormContainer>
            </ResponsiveContent>
          </ResponsiveContainer>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
} 