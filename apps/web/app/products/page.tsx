"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsAPI, api } from "../../lib/api";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import styled from "styled-components";
import { Search, Trash2, Plus, Edit } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import Modal from "../../components/ui/Modal";
import { useModal } from "../../hooks/useModal";
import { CreateProductData, UpdateProductData, EditingProduct, NewProduct } from "../../types/product.types";
import Image from "next/image";
import { ModernModal, ModernModalFooter } from "../../components/ui/ModernModal";
import { 
  ModernFormGroup, 
  ModernLabel, 
  ModernInput, 
  ModernTextArea, 
  ModernSelect, 
  ModernButton 
} from "../../components/ui/ModernForm";

const PageContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 40px 0 0 0;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  @media (max-width: 1120px) {
    padding: 20px 0 0 0;
  }
  
  @media (max-width: 480px) {
    padding: 16px 0 0 0;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
  
  @media (max-width: 1120px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.2rem;
  margin-bottom: 40px;
  font-weight: 500;
  line-height: 1.6;
  
  @media (max-width: 1120px) {
    font-size: 1.1rem;
    margin-bottom: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 24px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 24px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  
  &:focus-within {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
  }
  
  @media (max-width: 1120px) {
    padding: 14px 18px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    margin-bottom: 16px;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-size: 1rem;
  flex: 1;
  margin-left: 16px;
  outline: none;
  color: #1e293b;
  font-weight: 500;
  
  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }
  
  @media (max-width: 1120px) {
    font-size: 0.95rem;
    margin-left: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-left: 12px;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 1120px) {
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  @media (max-width: 1120px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.85rem;
  }
`;

const TrashIcon = styled(Trash2)`
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: 10px;
  cursor: pointer;
`;

const AddProductButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  position: relative;
  z-index: 1;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 1120px) {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    gap: 8px;
  }
`;


const EditIcon = styled(Edit)`
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  transition: all 0.2s ease;
  width: 18px;
  height: 18px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }
`;


const TableWrapper = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  overflow-x: auto;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  
  @media (max-width: 1120px) {
    min-width: 600px;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 20px 24px 16px 24px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:first-child {
    border-radius: 20px 0 0 0;
  }
  
  &:last-child {
    border-radius: 0 20px 0 0;
  }
  
  @media (max-width: 1120px) {
    padding: 18px 20px 14px 20px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 16px 18px 12px 18px;
    font-size: 0.85rem;
  }
`;

const Td = styled.td`
  padding: 20px 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  font-size: 0.95rem;
  color: #1e293b;
  background: transparent;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.02);
  }
  
  @media (max-width: 1120px) {
    padding: 18px 20px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 16px 18px;
    font-size: 0.85rem;
  }
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 1120px) {
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ProductImg = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProductName = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e293b;
  
  @media (max-width: 1120px) {
    font-size: 1rem;
  }
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 0.4em 1.2em;
  border-radius: 16px;
  font-size: 0.9em;
  font-weight: 600;
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))' 
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))'
  };
  color: ${({ $active }) => ($active ? '#059669' : '#dc2626')};
  border: 1px solid ${({ $active }) => 
    $active 
      ? 'rgba(34, 197, 94, 0.2)' 
      : 'rgba(239, 68, 68, 0.2)'
  };
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 1120px) {
    padding: 0.3em 1em;
    font-size: 0.85em;
  }
  
  @media (max-width: 480px) {
    padding: 0.25em 0.8em;
    font-size: 0.8em;
  }
`;


const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 32px 0 0 0;
  background: none;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.text.primary)};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  outline: none;
  
  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surface)};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: 16px;
  padding: 40px 48px;
  min-width: 420px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: left;
  
  @media (max-width: 1120px) {
    padding: 32px 32px;
    min-width: 350px;
    margin: 0 16px;
  }
  
  @media (max-width: 480px) {
    padding: 24px 24px;
    min-width: 300px;
    margin: 0 12px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 1120px) {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  
  @media (max-width: 1120px) {
    margin-top: 24px;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    margin-top: 20px;
    gap: 8px;
  }
`;

const CancelBtn = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: 16px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  
  @media (max-width: 1120px) {
    padding: 0.4rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 1rem;
    font-size: 0.85rem;
  }
`;

const ConfirmBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  
  @media (max-width: 1120px) {
    padding: 0.4rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 1rem;
    font-size: 0.85rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const HeroText = styled.div`
  h3 {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #475569);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  
  p {
    font-size: 1.1rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  @media (max-width: 768px) {
    h3 {
      font-size: 1.6rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const HeroImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 300px;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:nth-child(1) {
    grid-row: 1 / 3;
  }
  
  &:nth-child(2) {
    grid-row: 1 / 2;
  }
  
  &:nth-child(3) {
    grid-row: 2 / 3;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 16px;
  font-size: 0.9rem;
  font-weight: 600;
`;

// Fonction utilitaire pour Capitalize chaque mot même si tout est en majuscules
function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[-''])\S/g, (c) => c.toUpperCase());
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const { modalState, showSuccess, showError, hideModal } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsAPI.getAll().then((res) => res.data),
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const [showRadios, setShowRadios] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showConfirmDeleteSelected, setShowConfirmDeleteSelected] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>({
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

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await productsAPI.deleteAll();
    },
    onSuccess: () => {
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccess('Tous les produits ont été supprimés avec succès !');
    },
    onError: (error) => {
      showError('Erreur lors de la suppression : ' + (error instanceof Error ? error.message : String(error)));
    }
  });

  const deleteSelectedMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => productsAPI.delete(id)));
    },
    onSuccess: () => {
      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess('Suppression réussie des produits sélectionnés !');
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: CreateProductData) => {
      await api.post('/products/addProduct', productData);
    },
    onSuccess: () => {
      setShowAddProductModal(false);
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
      showSuccess('Produit créé avec succès !');
    },
    onError: (error) => {
      showError('Erreur lors de la création du produit : ' + (error instanceof Error ? error.message : String(error)));
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, productData }: { 
      id: string; 
      productData: UpdateProductData;
    }) => {
      await api.put(`/products/${id}`, productData);
    },
    onSuccess: () => {
      setShowEditProductModal(false);
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess('Produit modifié avec succès !');
    },
    onError: (error) => {
      showError('Erreur lors de la modification du produit : ' + (error instanceof Error ? error.message : String(error)));
    }
  });

  // Utiliser le statut réel de la base de données, avec "Active" par défaut si non défini
  const withStatus = products.map((p) => ({
    ...p,
    status: p.status || "Active",
  }));

  const paginatedProducts = withStatus
    .filter((p) => p.productType !== "ingredient")
    .filter(
      (p) =>
        (status === "all" || p.status.toLowerCase() === status) &&
        (category === "all" || p.category === category) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()))
    );

  const totalPages = Math.ceil(paginatedProducts.length / pageSize);
  const productsToShow = paginatedProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <DashboardLayout hideSidebar>
      <PageContainer>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <HeaderContainer>
            <HeaderLeft>
              <Title>PRODUITS</Title>
              <Subtitle>Gérez les produits de votre boutique avec style tunisien</Subtitle>
            </HeaderLeft>
            <HeaderRight>
              <AddProductButton onClick={() => setShowAddProductModal(true)}>
                <Plus size={18} />
                {mounted ? "Ajouter un produit" : ""}
              </AddProductButton>
            </HeaderRight>
          </HeaderContainer>

          <HeroSection>
            <HeroContent>
              <HeroText>
                <h3>Produits Inspirés de la Tunisie</h3>
                <p>
                  Découvrez notre collection de produits authentiques qui reflètent 
                  la richesse culturelle de la Tunisie. De la pâtisserie traditionnelle 
                  aux créations modernes, chaque produit raconte une histoire.
                </p>
              </HeroText>
              <HeroImages>
                <ImageContainer>
                  <Image
                    src="https://i.pinimg.com/736x/a1/8a/fd/a18afdc025ad7ca20518f8edcdcd3bd5.jpg"
                    alt="Pâtisserie tunisienne"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageOverlay>Pâtisserie Tunisienne</ImageOverlay>
                </ImageContainer>
                <ImageContainer>
                  <Image
                    src="https://www.leaders.com.tn/uploads/content/thumbnails/167327162678_content.jpg"
                    alt="Café tunisien"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageOverlay>Café Tunisien</ImageOverlay>
                </ImageContainer>
                <ImageContainer>
                  <Image
                    src="https://lapresse.tn/wp-content/uploads/2019/06/artisanat-1-850x491.jpg"
                    alt="Artisanat tunisien"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageOverlay>Artisanat Tunisien</ImageOverlay>
                </ImageContainer>
              </HeroImages>
            </HeroContent>
          </HeroSection>
          <SearchBar>
            <Search size={20} color="#bdbdbd" />
            <SearchInput
              placeholder={mounted ? t("products.search") : ""}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBar>
          <FiltersRow>
            <FilterSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">{mounted ? t("products.filters.status") : ""}</option>
              <option value="active">{mounted ? t("products.filters.active") : ""}</option>
              <option value="inactive">{mounted ? t("products.filters.inactive") : ""}</option>
            </FilterSelect>
            <FilterSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">{mounted ? t("products.filters.category") : ""}</option>
              <option value="Face">{mounted ? t("products.filters.face") : ""}</option>
              <option value="Body">{mounted ? t("products.filters.body") : ""}</option>
              <option value="Hair">{mounted ? t("products.filters.hair") : ""}</option>
            </FilterSelect>
          </FiltersRow>
          <TrashIcon
            size={22}
            onClick={() => {
              if (selectedProducts.length > 0) {
                setShowConfirmDeleteSelected(true);
              } else {
                setShowDeleteModal(true);
              }
            }}
          />
          {showDeleteModal && (
            <ModalOverlay>
              <ModalContent>
                <ModalTitle>{mounted ? t("products.modals.deleteTitle") : ""}</ModalTitle>
                <ModalFooter>
                  <CancelBtn
                    onClick={() => {
                      setShowDeleteModal(false);
                    }}
                  >
                    {mounted ? t("products.modals.cancel") : ""}
                  </CancelBtn>
                  <ConfirmBtn
                    onClick={() => {
                      deleteAllMutation.mutate();
                    }}
                  >
                    {mounted ? t("products.modals.confirm") : ""}
                  </ConfirmBtn>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          )}
          {showConfirmDeleteSelected && (
            <ModalOverlay>
              <ModalContent>
                <ModalTitle>{mounted ? t("products.modals.deleteSelectedTitle") : ""}</ModalTitle>
                <p>{mounted ? t("products.modals.deleteSelectedMessage", { count: selectedProducts.length }) : ""}</p>
                <ModalFooter>
                  <CancelBtn onClick={() => setShowConfirmDeleteSelected(false)}>
                    {mounted ? t("products.modals.cancel") : ""}
                  </CancelBtn>
                  <ConfirmBtn
                    onClick={() => {
                      deleteSelectedMutation.mutate(selectedProducts);
                      setShowConfirmDeleteSelected(false);
                    }}
                  >
                    {mounted ? t("products.modals.confirm") : ""}
                  </ConfirmBtn>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          )}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>{mounted ? t("products.table.product") : ""}</Th>
                  <Th>{mounted ? t("products.table.status") : ""}</Th>
                  <Th>{mounted ? t("products.table.category") : ""}</Th>
                  <Th>{mounted ? t("products.table.price") : ""}</Th>
                  <Th>Quantité</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {productsToShow.map((product) => (
                  <tr
                    key={String(product.id)}
                    onClick={() => setShowRadios(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Td>
                      <ProductCell>
                        {showRadios && (
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(String(product.id))}
                            onChange={e => {
                              e.stopPropagation();
                              setSelectedProducts(prev =>
                                prev.includes(String(product.id))
                                  ? prev.filter(id => id !== String(product.id))
                                  : [...prev, String(product.id)]
                              );
                            }}
                            onClick={e => e.stopPropagation()}
                          />
                        )}
                        <ProductImg src={product.image_url || product.image || '/placeholder.png'} alt={product.name} />
                        <ProductName>{capitalizeWords(product.name)}</ProductName>
                      </ProductCell>
                    </Td>
                    <Td>
                      <StatusBadge $active={product.status === 'Active'}>
                        {mounted ? (product.status === 'Active' ? t("common.active") : t("common.inactive")) : ""}
                      </StatusBadge>
                    </Td>
                    <Td>
                      {product.category}
                    </Td>
                    <Td>{product.price}€</Td>
                    <Td>{product.quantity || product.numberOfReviews || Math.floor(Math.random() * 100) + 1}</Td>
                    <Td>
                      <EditIcon 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct({
                            _id: product._id,
                            name: product.name,
                            title: product.title,
                            description: product.description,
                            price: product.price.toString(),
                            category: product.category,
                            productType: product.productType,
                            status: product.status,
                            image_url: product.image_url,
                            product_url: product.product_url,
                            quantity: product.quantity
                          });
                          setShowEditProductModal(true);
                        }}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
          <Pagination>
            <PageBtn onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="Page précédente">{'<'} </PageBtn>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber = i + 1;
              if (totalPages > 5) {
                if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }
              }
              if (pageNumber < 1 || pageNumber > totalPages) return null;
              return (
                <PageBtn
                  key={pageNumber}
                  $active={page === pageNumber}
                  onClick={() => setPage(pageNumber)}
                  disabled={page === pageNumber}
                >
                  {pageNumber}
                </PageBtn>
              );
            })}
            <PageBtn onClick={() => setPage(page + 1)} disabled={page === totalPages} aria-label="Page suivante">{'>'}</PageBtn>
          </Pagination>
          
          {/* Modal d'ajout de produit moderne */}
          <ModernModal
            isOpen={showAddProductModal}
            onClose={() => setShowAddProductModal(false)}
            title="Ajouter un nouveau produit"
            size="lg"
          >
            <ModernFormGroup>
              <ModernLabel required>Nom du produit</ModernLabel>
              <ModernInput
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Nom du produit"
                error={!newProduct.name && createProductMutation.isError}
              />
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel>Titre</ModernLabel>
              <ModernInput
                type="text"
                value={newProduct.title}
                onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                placeholder="Titre du produit"
              />
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel>Description</ModernLabel>
              <ModernTextArea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Description du produit"
                rows={4}
              />
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel required>Prix</ModernLabel>
              <ModernInput
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                placeholder="0.00"
                min="0"
                step="0.01"
                error={!newProduct.price && createProductMutation.isError}
              />
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel>Quantité</ModernLabel>
              <ModernInput
                type="number"
                value={newProduct.quantity || 0}
                onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                placeholder="0"
                min="0"
              />
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel required>Catégorie</ModernLabel>
              <ModernSelect
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                error={!newProduct.category && createProductMutation.isError}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Face">Face</option>
                <option value="Body">Body</option>
                <option value="Hair">Hair</option>
              </ModernSelect>
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel>Statut</ModernLabel>
              <ModernSelect
                value={newProduct.status}
                onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
              >
                <option value="Active">Actif</option>
                <option value="Inactive">Inactif</option>
              </ModernSelect>
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel>URL de l&apos;image</ModernLabel>
              <ModernInput
                type="url"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </ModernFormGroup>
            
            <ModernFormGroup>
              <ModernLabel>URL du produit</ModernLabel>
              <ModernInput
                type="url"
                value={newProduct.product_url}
                onChange={(e) => setNewProduct({...newProduct, product_url: e.target.value})}
                placeholder="https://example.com/product"
              />
            </ModernFormGroup>
            
            <ModernModalFooter>
              <ModernButton
                variant="secondary"
                onClick={() => setShowAddProductModal(false)}
              >
                Annuler
              </ModernButton>
              <ModernButton
                variant="primary"
                onClick={() => {
                  if (!newProduct.name || !newProduct.price || !newProduct.category) {
                    showError('Veuillez remplir tous les champs obligatoires');
                    return;
                  }
                  createProductMutation.mutate({
                    ...newProduct,
                    price: parseFloat(newProduct.price)
                  });
                }}
                loading={createProductMutation.isPending}
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? 'Création...' : 'Créer le produit'}
              </ModernButton>
            </ModernModalFooter>
          </ModernModal>

          {/* Modal de modification de produit moderne */}
          <ModernModal
            isOpen={showEditProductModal}
            onClose={() => setShowEditProductModal(false)}
            title="Modifier le produit"
            size="lg"
          >
            {editingProduct && (
              <>
                <ModernFormGroup>
                  <ModernLabel required>Nom</ModernLabel>
                  <ModernInput
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="Nom du produit"
                    error={!editingProduct.name && updateProductMutation.isError}
                  />
                </ModernFormGroup>
                
                <ModernFormGroup>
                  <ModernLabel>Titre</ModernLabel>
                  <ModernInput
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                    placeholder="Titre du produit"
                  />
                </ModernFormGroup>
                
                <ModernFormGroup>
                  <ModernLabel>Description</ModernLabel>
                  <ModernTextArea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    placeholder="Description du produit"
                    rows={4}
                  />
                </ModernFormGroup>
                
                <ModernFormGroup>
                  <ModernLabel required>Prix</ModernLabel>
                  <ModernInput
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    error={!editingProduct.price && updateProductMutation.isError}
                  />
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernLabel>Quantité</ModernLabel>
                  <ModernInput
                    type="number"
                    value={editingProduct.quantity || 0}
                    onChange={(e) => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                  />
                </ModernFormGroup>
                
                <ModernFormGroup>
                  <ModernLabel required>Catégorie</ModernLabel>
                  <ModernSelect
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    error={!editingProduct.category && updateProductMutation.isError}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Face">Face</option>
                    <option value="Body">Body</option>
                    <option value="Hair">Hair</option>
                  </ModernSelect>
                </ModernFormGroup>
                
                <ModernFormGroup>
                  <ModernLabel>Statut</ModernLabel>
                  <ModernSelect
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value})}
                  >
                    <option value="Active">Actif</option>
                    <option value="Inactive">Inactif</option>
                  </ModernSelect>
                </ModernFormGroup>
                
                <ModernFormGroup>
                  <ModernLabel>URL de l&apos;image</ModernLabel>
                  <ModernInput
                    type="url"
                    value={editingProduct.image_url || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </ModernFormGroup>
                
                <ModernFormGroup>
                  <ModernLabel>URL du produit</ModernLabel>
                  <ModernInput
                    type="url"
                    value={editingProduct.product_url || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, product_url: e.target.value})}
                    placeholder="https://example.com/product"
                  />
                </ModernFormGroup>
                
                <ModernModalFooter>
                  <ModernButton
                    variant="secondary"
                    onClick={() => setShowEditProductModal(false)}
                  >
                    Annuler
                  </ModernButton>
                  <ModernButton
                    variant="primary"
                    onClick={() => {
                      if (!editingProduct.name || !editingProduct.price || !editingProduct.category) {
                        showError('Veuillez remplir tous les champs obligatoires');
                        return;
                      }
                      updateProductMutation.mutate({
                        id: editingProduct._id,
                        productData: {
                          name: editingProduct.name,
                          title: editingProduct.title || '',
                          description: editingProduct.description || '',
                          price: parseFloat(editingProduct.price),
                          category: editingProduct.category,
                          productType: editingProduct.productType,
                          status: editingProduct.status,
                          image_url: editingProduct.image_url || '',
                          product_url: editingProduct.product_url || '',
                          quantity: editingProduct.quantity || 0
                        }
                      });
                    }}
                    loading={updateProductMutation.isPending}
                    disabled={updateProductMutation.isPending}
                  >
                    {updateProductMutation.isPending ? 'Modification...' : 'Modifier le produit'}
                  </ModernButton>
                </ModernModalFooter>
              </>
            )}
          </ModernModal>

          {/* Modal pour les notifications */}
          <Modal
            isOpen={modalState.isOpen}
            onClose={hideModal}
            title={modalState.title}
            message={modalState.message}
            type={modalState.type}
            onConfirm={modalState.onConfirm}
            confirmText={modalState.confirmText}
            cancelText={modalState.cancelText}
            showCancel={modalState.showCancel}
          />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
