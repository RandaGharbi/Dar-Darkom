"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../../components/styled/GlobalStyles";
import styled from "styled-components";
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { productsAPI } from "../../../lib/api";
import { toast } from "react-hot-toast";

const Container = styled.div`
  padding: 2rem;
  background: #fff;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem 0;

  &:hover {
    color: #333;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #222;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
`;

const Form = styled.form`
  max-width: 800px;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
  color: #222;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #f5a623;
    box-shadow: 0 0 0 3px rgb(245 166 35 / 0.08);
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
  color: #222;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #f5a623;
    box-shadow: 0 0 0 3px rgb(245 166 35 / 0.08);
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
  color: #222;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f5a623;
    box-shadow: 0 0 0 3px rgb(245 166 35 / 0.08);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
`;

const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f5a623;
  font-weight: 600;
`;

const SaveButton = styled.button`
  background: #f5a623;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #e5941a;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const categories = [
  "Face Care",
  "Body Care", 
  "Hair Care",
  "Skin Care",
  "Makeup",
  "Fragrance",
  "Tools & Accessories"
];

const types = [
  "Serum",
  "Cream",
  "Lotion",
  "Cleanser",
  "Toner",
  "Mask",
  "Oil",
  "Sunscreen",
  "Exfoliator",
  "Moisturizer"
];

interface ProductInput {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  type: string;
  product_url: string;
  metadata: string;
  image_url: string;
  customerRating: number;
  numberOfReviews: number;
}

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    subtitle: "",
    description: "",
    price: "",
    inventory: "",
    category: "",
    type: "",
    product_url: "",
    metadata: "",
    image_url: "",
    customerRating: 4.5,
    numberOfReviews: 123
  });

  const addProductMutation = useMutation({
    mutationFn: (data: ProductInput) => productsAPI.create(data),
    onSuccess: () => {
      toast.success("Produit ajouté avec succès !");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout du produit");
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      inventory: parseInt(formData.inventory) || 0,
      customerRating: parseFloat(formData.customerRating.toString()) || 0,
      numberOfReviews: parseInt(formData.numberOfReviews.toString()) || 0
    };

    addProductMutation.mutate(productData);
  };

  return (
    <>
      <GlobalStyles />
      <DashboardLayout hideSidebar>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <ArrowLeft size={16} />
              Retour
            </BackButton>
            <Title>Add product</Title>
            <Subtitle>This product will show up across your store and channels.</Subtitle>
          </Header>

          <Form onSubmit={handleSubmit}>
            <FormSection>
              <Label>Product name</Label>
              <Input
                type="text"
                placeholder="e.g. HydrationSerum"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </FormSection>

            <FormSection>
              <Label>Product title</Label>
              <Input
                type="text"
                placeholder="e.g. HydrationSerum"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </FormSection>

            <FormSection>
              <Label>Product subtitle</Label>
              <Input
                type="text"
                placeholder="e.g. 50ml"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
              />
            </FormSection>

            <FormSection>
              <Label>Description</Label>
              <TextArea
                placeholder="Enter product description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </FormSection>

            <Row>
              <FormSection>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 29.99"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </FormSection>

              <FormSection>
                <Label>Inventory</Label>
                <Input
                  type="number"
                  placeholder="e.g. 100"
                  value={formData.inventory}
                  onChange={(e) => handleInputChange("inventory", e.target.value)}
                  required
                />
              </FormSection>
            </Row>

            <Row>
              <FormSection>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormSection>

              <FormSection>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </FormSection>
            </Row>

            <FormSection>
              <Label>Product URL</Label>
              <Input
                type="text"
                placeholder="e.g. /products/hydration-serum"
                value={formData.product_url}
                onChange={(e) => handleInputChange("product_url", e.target.value)}
              />
            </FormSection>

            <FormSection>
              <Label>Image URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
              />
            </FormSection>

            <FormSection>
              <Label>Metadata</Label>
              <TextArea
                placeholder="Enter product metadata..."
                value={formData.metadata}
                onChange={(e) => handleInputChange("metadata", e.target.value)}
              />
            </FormSection>

            <BottomSection>
              <RatingInfo>
                <span>Customer rating</span>
                <Rating>
                  <Star size={16} fill="#f5a623" />
                  {formData.customerRating}
                </Rating>
                <span>Based on {formData.numberOfReviews} reviews</span>
              </RatingInfo>

              <SaveButton 
                type="submit" 
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending ? "Saving..." : "Save"}
              </SaveButton>
            </BottomSection>
          </Form>
        </Container>
      </DashboardLayout>
    </>
  );
} 