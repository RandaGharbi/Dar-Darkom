import React, { useState } from "react";
import styled from "styled-components";
import { Heart, Loader2, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { favoritesAPI } from "../../lib/api";

interface FavoritesTabProps {
  userId: string;
}

const TabContainer = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.border};
    border-color: ${({ theme }) => theme.colors.text.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const RetryButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FavoriteCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  transition: all 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  margin-bottom: 16px;
`;

const ProductName = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  line-height: 1.4;
`;

const ProductCategory = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProductPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

interface ProductImageComponentProps {
  imageUrl?: string;
  productName: string;
}

const ProductImageComponent: React.FC<ProductImageComponentProps> = ({ imageUrl, productName }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (!imageUrl || imageError) {
    return (
      <ImageFallback>
        <Heart size={32} />
      </ImageFallback>
    );
  }

  return (
    <ProductImageContainer>
      {imageLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(247, 245, 242, 0.8)',
          zIndex: 1
        }}>
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}
      <ProductImage
        src={imageUrl}
        alt={productName}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ opacity: imageLoading ? 0 : 1 }}
      />
    </ProductImageContainer>
  );
};

export const FavoritesTab: React.FC<FavoritesTabProps> = ({ userId }) => {
  const {
    data: favoritesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-favorites", userId],
    queryFn: () => favoritesAPI.getByUser(userId).then((res) => res.data),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Favoris</TabTitle>
          <RefreshButton disabled>
            <Loader2 size={16} className="animate-spin" />
          </RefreshButton>
        </TabHeader>
        <LoadingContainer>
          <Loader2 size={48} className="animate-spin" />
          <p style={{ marginTop: '16px', fontSize: '14px' }}>Chargement des favoris...</p>
        </LoadingContainer>
      </TabContainer>
    );
  }

  if (error) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Favoris</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </RefreshButton>
        </TabHeader>
        <ErrorContainer>
          <Heart size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Erreur de chargement</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Impossible de charger les favoris. Veuillez réessayer.
          </p>
          <RetryButton onClick={() => refetch()}>
            Réessayer
          </RetryButton>
        </ErrorContainer>
      </TabContainer>
    );
  }

  const favorites = favoritesData?.favorites || [];

  if (favorites.length === 0) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Favoris</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </RefreshButton>
        </TabHeader>
        <EmptyContainer>
          <Heart size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Aucun favori</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Cet utilisateur n&apos;a pas encore ajouté de produits à ses favoris.
          </p>
        </EmptyContainer>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      <TabHeader>
        <TabTitle>Favoris ({favorites.length})</TabTitle>
        <RefreshButton onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </RefreshButton>
      </TabHeader>

      <FavoritesGrid>
        {favorites.map((favorite) => (
          <FavoriteCard key={favorite._id}>
            <ProductImageComponent 
              imageUrl={favorite.image_url} 
              productName={favorite.title}
            />

            <ProductInfo>
              <ProductName>{favorite.title}</ProductName>
              <ProductCategory>{favorite.category}</ProductCategory>
            </ProductInfo>

            <ProductPrice>{favorite.price.toFixed(2)} €</ProductPrice>
          </FavoriteCard>
        ))}
      </FavoritesGrid>
    </TabContainer>
  );
};
