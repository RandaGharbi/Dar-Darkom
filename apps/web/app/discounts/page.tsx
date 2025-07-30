"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import styled from "styled-components";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Calendar,
  Tag,
  Users,
  Clock
} from "lucide-react";
import { toast } from "react-hot-toast";
import { discountsAPI, Discount } from "../../lib/api";

const Container = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: #faf9f6;
  color: #222;

  &:focus {
    outline: none;
    border-color: #bfa77a;
    box-shadow: 0 0 0 3px rgba(191, 167, 122, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem 0.6rem 2.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.7rem 0.5rem 2rem;
    font-size: 0.85rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  
  @media (max-width: 768px) {
    left: 0.6rem;
  }
  
  @media (max-width: 480px) {
    left: 0.5rem;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #222;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
  }
`;

const DiscountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const DiscountCard = styled.div`
  background: #f5efe7;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px 0 #e9e9e9;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 #d0d0d0;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #171412;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
  
  @media (max-width: 768px) {
    width: 1.8rem;
    height: 1.8rem;
  }
  
  @media (max-width: 480px) {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const DiscountValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #bfa77a;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const DiscountCode = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #171412;
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.85rem;
  }
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #bfa77a;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

const DiscountDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #827869;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 0.3em 1em;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
  background: ${({ $active }) => ($active ? "#e8f5e9" : "#fbe9e7")};
  color: ${({ $active }) => ($active ? "#388e3c" : "#d84315")};
  
  @media (max-width: 768px) {
    padding: 0.25em 0.8em;
    font-size: 0.8em;
  }
  
  @media (max-width: 480px) {
    padding: 0.2em 0.6em;
    font-size: 0.75em;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #827869;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
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
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    width: 98%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #171412;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #171412;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #171412;
  background: #fff;
  
  &:focus {
    outline: none;
    border-color: #bfa77a;
    box-shadow: 0 0 0 3px rgba(191, 167, 122, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #171412;
  background: #fff;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #bfa77a;
    box-shadow: 0 0 0 3px rgba(191, 167, 122, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #171412;
  background: #fff;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #bfa77a;
    box-shadow: 0 0 0 3px rgba(191, 167, 122, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #171412;
  cursor: pointer;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: #bfa77a;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e5e5;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

// Types pour les réductions (utilise l'interface de l'API)

// Utilisation des vraies données de l'API

// Fonction utilitaire pour le statut dynamique
const isCurrentlyActive = (discount: Discount) => {
  const now = new Date();
  const start = new Date(discount.startDate);
  const end = new Date(discount.endDate);
  return now >= start && now <= end;
};

export default function DiscountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minAmount: "",
    maxUses: "",
    startDate: "",
    endDate: "",
    applicableTo: "all" as "all" | "specific_products" | "specific_categories",
    active: true,
    description: "",
    discountCollection: "general"
  });
  const queryClient = useQueryClient();

  // Remplacer la récupération de tous les discounts par la collection soldes_france
  const { data: discountsData, isLoading } = useQuery({
    queryKey: ["discounts", "soldes_france"],
    queryFn: async () => {
      const response = await discountsAPI.getByCollection("soldes_france");
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      // L'API retourne { success: true, data: [...] }, nous retournons l'objet complet
      return response.data;
    },
  });

  // S'assurer que discounts est toujours un tableau en extrayant de discountsData.data
  const discounts = Array.isArray(discountsData?.data) ? discountsData.data : [];
  
  // Debug: afficher les données reçues
  console.log('discountsData:', discountsData);
  console.log('discounts:', discounts);
  console.log('isLoading:', isLoading);

  const createMutation = useMutation({
    mutationFn: (newDiscount: Omit<Discount, '_id' | 'usedCount' | 'createdAt' | 'updatedAt'>) => 
      discountsAPI.create(newDiscount).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success("Réduction créée avec succès");
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Discount> }) =>
      discountsAPI.update(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts", "soldes_france"] });
      toast.success("Réduction modifiée avec succès");
      setIsEditMode(false);
      setEditingDiscountId(null);
      resetForm();
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => discountsAPI.delete(id).then(() => id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success("Réduction supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "percentage",
      value: "",
      minAmount: "",
      maxUses: "",
      startDate: "",
      endDate: "",
      applicableTo: "all",
      active: true,
      description: "",
      discountCollection: "soldes_france"
    });
    setIsEditMode(false);
    setEditingDiscountId(null);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.value || !formData.maxUses || !formData.startDate || !formData.endDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const discountPayload = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      minAmount: formData.minAmount ? parseFloat(formData.minAmount) : undefined,
      maxUses: parseInt(formData.maxUses),
      startDate: formData.startDate,
      endDate: formData.endDate,
      active: formData.active,
      applicableTo: formData.applicableTo,
      description: formData.description,
      discountCollection: 'soldes_france',
    };

    if (isEditMode && editingDiscountId) {
      updateMutation.mutate({ id: editingDiscountId, data: discountPayload });
    } else {
      createMutation.mutate(discountPayload);
    }
  };

  const filteredDiscounts = (Array.isArray(discounts) ? discounts : []).filter((discount) => {
    const matchesSearch = 
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && discount.active) ||
      (statusFilter === "inactive" && !discount.active);
    
    const matchesType = typeFilter === "all" || discount.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copié dans le presse-papiers");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réduction ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (discount: Discount) => {
    setIsEditMode(true);
    setEditingDiscountId(discount._id);
    setFormData({
      name: discount.name,
      code: discount.code,
      type: discount.type,
      value: discount.value.toString(),
      minAmount: discount.minAmount?.toString() || "",
      maxUses: discount.maxUses.toString(),
      startDate: discount.startDate.slice(0, 10),
      endDate: discount.endDate.slice(0, 10),
      applicableTo: discount.applicableTo,
      active: discount.active,
      description: discount.description || "",
      discountCollection: 'soldes_france',
    });
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getUsagePercentage = (used: number, max: number) => {
    return Math.round((used / max) * 100);
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Réductions & Promotions</Title>
          <AddButton onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Nouvelle Réduction
          </AddButton>
        </Header>

        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Rechercher une réduction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FiltersRow>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </FilterSelect>

          <FilterSelect
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="percentage">Pourcentage</option>
            <option value="fixed">Montant fixe</option>
          </FilterSelect>
        </FiltersRow>

        {isLoading ? (
          <EmptyState>Chargement...</EmptyState>
        ) : filteredDiscounts.length === 0 ? (
          <EmptyState>
            <h3>Aucune réduction trouvée</h3>
            <p>Créez votre première réduction pour commencer</p>
          </EmptyState>
        ) : (
          <DiscountsGrid>
            {filteredDiscounts.map((discount) => (
                              <DiscountCard key={discount._id}>
                <CardHeader>
                  <CardTitle>{discount.name}</CardTitle>
                  <CardActions>
                    <ActionButton onClick={() => handleCopyCode(discount.code)}>
                      <Copy size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => handleEdit(discount)}>
                      <Edit size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(discount._id)}>
                      <Trash2 size={16} />
                    </ActionButton>
                  </CardActions>
                </CardHeader>

                <DiscountValue>
                  {discount.type === 'percentage' ? `-${discount.value}%` : `-${discount.value}€`}
                </DiscountValue>

                <DiscountCode>
                  {discount.code}
                  <CopyButton onClick={() => handleCopyCode(discount.code)}>
                    <Copy size={14} />
                  </CopyButton>
                </DiscountCode>

                <DiscountDetails>
                  <DetailItem>
                    <Calendar size={14} />
                    {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                  </DetailItem>
                  
                  <DetailItem>
                    <Users size={14} />
                    {discount.usedCount}/{discount.maxUses} utilisations 
                    ({getUsagePercentage(discount.usedCount, discount.maxUses)}%)
                  </DetailItem>
                  
                  {discount.minAmount && (
                    <DetailItem>
                      <Tag size={14} />
                      Min. {discount.minAmount}€
                    </DetailItem>
                  )}
                  
                  <DetailItem>
                    <Clock size={14} />
                    {isCurrentlyActive(discount) ? (
                      <StatusBadge $active={true}>Active</StatusBadge>
                    ) : (
                      <StatusBadge $active={false}>Inactive</StatusBadge>
                    )}
                  </DetailItem>
                </DiscountDetails>
              </DiscountCard>
            ))}
          </DiscountsGrid>
        )}

        {/* Modal de création */}
        <ModalOverlay $isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{isEditMode ? "Modifier Réduction" : "Nouvelle Réduction"}</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <Row>
                <FormGroup>
                  <Label>Nom de la réduction *</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Soldes d'Été -25%"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Code promo *</Label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                      placeholder="Ex: SOLDES2024"
                      style={{ flex: 1 }}
                      required
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      style={{
                        padding: '0.75rem',
                        background: '#f5f5f5',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Générer
                    </button>
                  </div>
                </FormGroup>
              </Row>

              <Row>
                <FormGroup>
                  <Label>Type de réduction *</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (€)</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Valeur *</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    placeholder={formData.type === 'percentage' ? "20" : "10"}
                    min="0"
                    max={formData.type === 'percentage' ? "100" : "1000"}
                    step={formData.type === 'percentage' ? "1" : "0.01"}
                    required
                  />
                </FormGroup>
              </Row>

              <Row>
                <FormGroup>
                  <Label>Montant minimum (optionnel)</Label>
                  <Input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => handleInputChange('minAmount', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Nombre maximum d&apos;utilisations</Label>
                  <Input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => handleInputChange('maxUses', e.target.value)}
                    placeholder="100"
                    min="1"
                    required
                  />
                </FormGroup>
              </Row>

              <Row>
                <FormGroup>
                  <Label>Date de début *</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Date de fin *</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate}
                    required
                  />
                </FormGroup>
              </Row>

              <FormGroup>
                <Label>Applicable à</Label>
                <Select
                  value={formData.applicableTo}
                  onChange={(e) => handleInputChange('applicableTo', e.target.value)}
                >
                  <option value="all">Tous les produits</option>
                  <option value="specific_products">Produits spécifiques</option>
                  <option value="specific_categories">Catégories spécifiques</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Description (optionnel)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description de la réduction..."
                />
              </FormGroup>

              <FormGroup>
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                  />
                  Activer immédiatement cette réduction
                </CheckboxLabel>
              </FormGroup>

              <ModalFooter>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </CancelButton>
                <SaveButton type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {isEditMode ? "Modifier la réduction" : "Créer la réduction"}
                </SaveButton>
              </ModalFooter>
            </Form>
          </ModalContent>
        </ModalOverlay>
      </Container>
    </DashboardLayout>
  );
} 