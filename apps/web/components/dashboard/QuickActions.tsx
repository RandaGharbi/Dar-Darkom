"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const ActionsRow = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
  }
`;

const MainButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0.9rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  width: 100%;
  text-decoration: none;
  display: block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #64748b;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  padding: 0.9rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-decoration: none;
  display: block;

  &:hover {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionsTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1.2rem 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
`;

const ImageSection = styled.div`
  margin-top: 2rem;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1),
    rgba(139, 92, 246, 0.1)
  );
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1.5rem;
  z-index: 2;
`;

const ImageTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ImageDescription = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
`;

export const QuickActions = () => {
  const router = useRouter();

  return (
    <div>
      <ActionsTitle>Actions Rapides</ActionsTitle>
      <ActionsRow>
        <Link href="/products/addProducts">
          <MainButton>
            Ajouter un Produit
          </MainButton>
        </Link>
        <Link href="/orders">
          <SecondaryButton>
            Voir les Commandes
          </SecondaryButton>
        </Link>
        <Link href="/products">
          <SecondaryButton>
            Gérer l&apos;Inventaire
          </SecondaryButton>
        </Link>
        <Link href="/employee-management">
          <SecondaryButton>
            Gérer les Employés
          </SecondaryButton>
        </Link>
      </ActionsRow>

      <ImageSection>
        <ImageContainer>
          <Image
            src="https://images.musement.com/cover/0171/77/thumb_17076552_cover_header.jpg"
            alt="Sidi Bou Saïd, Tunisie - Village bleu et blanc emblématique"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <ImageOverlay>
            <ImageTitle>🇹🇳 Sidi Bou Saïd</ImageTitle>
            <ImageDescription>
              Le village bleu et blanc emblématique de la Tunisie, source
              d&apos;inspiration pour vos créations authentiques.
            </ImageDescription>
          </ImageOverlay>
        </ImageContainer>
      </ImageSection>
    </div>
  );
};
