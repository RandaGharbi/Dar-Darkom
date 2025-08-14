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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  width: 100%;
  
  @media (max-width: 1120px) {
    padding: 10px 14px;
    margin-bottom: 18px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    margin-bottom: 16px;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-size: 0.95rem;
  flex: 1;
  margin-left: 12px;
  outline: none;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  @media (max-width: 1120px) {
    font-size: 0.9rem;
    margin-left: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-left: 8px;
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
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 1120px) {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
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
  gap: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
    opacity: 0.9;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 1120px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    gap: 6px;
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

const AddProductModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const AddProductModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  @media (max-width: 768px) {
    padding: 24px;
    margin: 10px;
  }
`;

const AddProductModalTitle = styled.h2`
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
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddProductModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const AddProductCancelBtn = styled.button`
  padding: 12px 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const AddProductConfirmBtn = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  
  @media (max-width: 480px) {
    border-radius: 8px;
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
  padding: 16px 20px 12px 20px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: 400;
  font-size: 0.95rem;
  background: transparent;
  
  @media (max-width: 1120px) {
    padding: 14px 16px 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px 8px 14px;
    font-size: 0.85rem;
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.table.row};
  
  @media (max-width: 1120px) {
    padding: 14px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px;
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
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
  background: #f5f5f5;
`;

const ProductName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 1120px) {
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 0.3em 1em;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: 500;
  background: transparent;
  color: ${({ $active }) => ($active ? '#22c55e' : '#ef4444')};
  
  @media (max-width: 1120px) {
    padding: 0.25em 0.8em;
    font-size: 0.85em;
  }
  
  @media (max-width: 480px) {
    padding: 0.2em 0.6em;
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
              <Title>{mounted ? t("products.title") : ""}</Title>
              <Subtitle>{mounted ? t("products.subtitle") : ""}</Subtitle>
            </HeaderLeft>
            <HeaderRight>
              <AddProductButton onClick={() => setShowAddProductModal(true)}>
                <Plus size={18} />
                {mounted ? "Ajouter un produit" : ""}
              </AddProductButton>
            </HeaderRight>
          </HeaderContainer>
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
          
          {/* Modal d'ajout de produit */}
          {showAddProductModal && (
            <AddProductModalOverlay onClick={() => setShowAddProductModal(false)}>
              <AddProductModalContent onClick={(e) => e.stopPropagation()}>
                <AddProductModalTitle>Ajouter un nouveau produit</AddProductModalTitle>
                
                <FormGroup>
                  <Label>Nom du produit *</Label>
                  <Input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Nom du produit"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Titre</Label>
                  <Input
                    type="text"
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
                
                <FormGroup>
                  <Label>URL du produit</Label>
                  <Input
                    type="url"
                    value={newProduct.product_url}
                    onChange={(e) => setNewProduct({...newProduct, product_url: e.target.value})}
                    placeholder="https://example.com/product"
                  />
                </FormGroup>
                
                <AddProductModalFooter>
                  <AddProductCancelBtn onClick={() => setShowAddProductModal(false)}>
                    Annuler
                  </AddProductCancelBtn>
                  <AddProductConfirmBtn
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
                    disabled={createProductMutation.isPending}
                  >
                    {createProductMutation.isPending ? 'Création...' : 'Créer le produit'}
                  </AddProductConfirmBtn>
                </AddProductModalFooter>
              </AddProductModalContent>
            </AddProductModalOverlay>
          )}

          {/* Modal de modification de produit */}
          {showEditProductModal && editingProduct && (
            <AddProductModalOverlay onClick={() => setShowEditProductModal(false)}>
              <AddProductModalContent onClick={(e) => e.stopPropagation()}>
                <AddProductModalTitle>Modifier le produit</AddProductModalTitle>
                
                <FormGroup>
                  <Label>Nom *</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="Nom du produit"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Titre</Label>
                  <Input
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                    placeholder="Titre du produit"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    placeholder="Description du produit"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Prix *</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    value={editingProduct.quantity || 0}
                    onChange={(e) => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Catégorie *</Label>
                  <Select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
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
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value})}
                  >
                    <option value="Active">Actif</option>
                    <option value="Inactive">Inactif</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label>URL de l&apos;image</Label>
                  <Input
                    type="url"
                    value={editingProduct.image_url || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>URL du produit</Label>
                  <Input
                    type="url"
                    value={editingProduct.product_url || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, product_url: e.target.value})}
                    placeholder="https://example.com/product"
                  />
                </FormGroup>
                
                <AddProductModalFooter>
                  <AddProductCancelBtn onClick={() => setShowEditProductModal(false)}>
                    Annuler
                  </AddProductCancelBtn>
                  <AddProductConfirmBtn
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
                    disabled={updateProductMutation.isPending}
                  >
                    {updateProductMutation.isPending ? 'Modification...' : 'Modifier le produit'}
                  </AddProductConfirmBtn>
                </AddProductModalFooter>
              </AddProductModalContent>
            </AddProductModalOverlay>
          )}

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
