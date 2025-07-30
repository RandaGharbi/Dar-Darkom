"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import { Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "../../hooks/useTranslation";
import { authAPI } from "../../lib/api";
import { LanguageSelector } from "../LanguageSelector";
import NotificationDropdown from "../NotificationDropdown";
import NotificationToastManager from "../NotificationToastManager";
import NotificationPermissionRequest from "../NotificationPermissionRequest";

import Image from "next/image";
import { removeToken } from "../../utils/auth";
import { ThemeToggle } from "../ThemeToggle";

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.sidebar.background};
  transition: transform 0.3s ease;
  border-right: 1px solid ${({ theme }) => theme.colors.sidebar.border};
  display: none;

  @media (max-width: 1120px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Remplacement de Nav
const StyledNav = styled.nav<{ $horizontal?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$horizontal ? "row" : "column")};
  gap: ${(props) => (props.$horizontal ? "1.5rem" : "1rem")};
  justify-content: ${(props) => (props.$horizontal ? "center" : "flex-start")};
  align-items: center;
  width: 100%;
  font-size: 17px;
  padding: ${(props) => (props.$horizontal ? "0" : "1rem 1.5rem")};

  @media (max-width: 1120px) {
    font-size: ${(props) => (props.$horizontal ? "14px" : "16px")};
    gap: ${(props) => (props.$horizontal ? "1rem" : "0.75rem")};
  }

  @media (max-width: 480px) {
    font-size: ${(props) => (props.$horizontal ? "13px" : "15px")};
    gap: ${(props) => (props.$horizontal ? "0.75rem" : "0.5rem")};
  }
`;

type NavProps = React.HTMLAttributes<HTMLElement> & { horizontal?: boolean };
const Nav = ({ horizontal, ...rest }: NavProps) => (
  <StyledNav $horizontal={horizontal} {...rest} />
);

const HorizontalNavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 0.5rem 0;

  @media (max-width: 1120px) {
    display: none;
  }
`;

// NavItem intermédiaire pour ne pas propager $active et pour compatibilité styled-components v4 + Next.js
const NavItemBase = styled.div<{ $active?: boolean }>`
  color: ${(props) =>
    props.$active
      ? props.theme.colors.text.primary
      : props.theme.colors.text.muted};
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: color 0.2s;
  white-space: nowrap;
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  @media (max-width: 1120px) {
    padding: 0.4rem 0.8rem;
  }
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
  }
`;

type NavItemProps = React.ComponentPropsWithoutRef<typeof Link> & { $active?: boolean };
const NavItem = ({ $active, children, ...rest }: NavItemProps) => (
  <Link {...rest}>
    <NavItemBase $active={$active}>{children}</NavItemBase>
  </Link>
);

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 1120px) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;

  @media (max-width: 1120px) {
    width: 100%;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background};
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 1120px) {
    padding: 0 16px;
    height: 56px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    height: 52px;
  }
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }

  @media (max-width: 1120px) {
    display: flex;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1120px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};

  @media (max-width: 1120px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
`;

const LogoImg = styled.img`
  height: 44px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
  margin-right: 32px;
  filter: ${({ theme }) => 
    theme.colors.background === '#1a1a1a' || theme.colors.background === '#000000' 
      ? 'brightness(0) invert(1)' 
      : 'none'
  };

  @media (max-width: 1120px) {
    height: 36px;
    margin-right: 16px;
    max-width: 120px;
  }

  @media (max-width: 480px) {
    height: 32px;
    margin-right: 12px;
    max-width: 100px;
  }
`;

// Composant Logo conditionnel
const AdaptiveLogo = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    router.push('/');
  };

  // Ne rendre que côté client pour éviter l'hydratation
  if (!mounted) {
    return <div style={{ width: '140px', height: '44px' }} />;
  }

  return (
    <LogoImg 
      src="/logoGuerlain.png" 
      alt="Guerlain" 
      onClick={handleLogoClick}
      style={{ cursor: 'pointer' }}
    />
  );
};

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  transition: color 0.2s ease;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    color: #dc2626;
    background-color: #fef2f2;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;

  @media (min-width: 1121px) {
    display: none;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const navigationItems = [
  { href: "/", label: "navigation.dashboard" },
  { href: "/products", label: "navigation.products" },
  { href: "/orders", label: "navigation.orders" },
  { href: "/users", label: "navigation.customers" },
  { href: "/analytics", label: "navigation.analytics" },
  { href: "/discounts", label: "navigation.discounts" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export const DashboardLayout = ({ children, hideSidebar }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => authAPI.getMe().then((res) => res.data),
  });

  // Debug: afficher les données utilisateur (commented out for tests)
  // useEffect(() => {
  //   console.log('User data in DashboardLayout:', user);
  //   console.log('User ID:', user?.user?._id);
  // }, [user]);

  const handleLogout = async () => {
    try {
      // Appeler l'API backend pour le logout
      await authAPI.logout();
      
      // Supprimer le token localement
      removeToken();
      
      // Rediriger vers la page de login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Même en cas d'erreur, on supprime le token localement
      removeToken();
      router.push("/login");
    }
  };

  return (
    <LayoutContainer>
      {!hideSidebar && (
        <>
          <Sidebar $isOpen={sidebarOpen}>
            <SidebarHeader>
              <Logo>
                <AdaptiveLogo />
                GUERLAIN PARIS
              </Logo>
            </SidebarHeader>
            <Nav>
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  $active={pathname === item.href}
                >
                  {mounted
                    ? item.label === "navigation.marketing"
                      ? "Marketing"
                      : t(item.label)
                    : item.label}
                </NavItem>
              ))}
            </Nav>
          </Sidebar>
          <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
        </>
      )}
      <MainContent>
        <TopBar>
          <div style={{ display: "flex", alignItems: "center" }}>
            {!hideSidebar && (
              <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={24} />
              </MenuButton>
            )}
            <Logo>
              <AdaptiveLogo />
            </Logo>
            <LanguageSelector />
          </div>

          {mounted && (
            <HorizontalNavWrapper>
              <Nav horizontal>
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    $active={pathname === item.href}
                  >
                    {item.label === "navigation.marketing"
                      ? "Marketing"
                      : t(item.label)}
                  </NavItem>
                ))}
              </Nav>
            </HorizontalNavWrapper>
          )}

                      <UserMenu>
              <HeaderControls>
                <ThemeToggle />
                {/* Debug: {console.log('User data:', user)} */}
                {user?.user?._id ? (
                  <NotificationDropdown userId={user.user._id} />
                ) : (
                  <NotificationDropdown userId="demo" />
                )}
              </HeaderControls>

            {user?.user?._id && <NotificationToastManager userId={user.user._id} />}
            {user?.user?._id && <NotificationPermissionRequest userId={user.user._id} />}

            <UserAvatar>
              {user?.profileImage ? (
                <Image
                  src={user.profileImage.replace("10.0.2.2", "localhost")}
                  alt={user.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.parentElement?.querySelector(
                      ".header-avatar-fallback"
                    );
                    if (fallback) {
                      (fallback as HTMLElement).style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="header-avatar-fallback"
                style={{
                  display: user?.profileImage ? "none" : "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0) || "A"}
              </div>
            </UserAvatar>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
            </LogoutButton>
          </UserMenu>
        </TopBar>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};
