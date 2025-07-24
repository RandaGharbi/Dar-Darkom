describe('Navigation E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('peut naviguer entre toutes les pages principales', () => {
    // Vérifier que la page d'accueil se charge
    cy.get('body').should('be.visible');

    // Naviguer vers Dashboard
    cy.contains('Dashboard').click();
    cy.url().should('include', '/');
    cy.contains('Dashboard').should('be.visible');

    // Naviguer vers Products
    cy.contains('Products').click();
    cy.url().should('include', '/products');
    cy.contains('Gestion des produits').should('be.visible');

    // Naviguer vers Orders
    cy.contains('Orders').click();
    cy.url().should('include', '/orders');
    cy.contains('Gestion des commandes').should('be.visible');

    // Naviguer vers Analytics
    cy.contains('Analytics').click();
    cy.url().should('include', '/analytics');
    cy.contains('Analytics').should('be.visible');

    // Naviguer vers Discounts
    cy.contains('Discounts').click();
    cy.url().should('include', '/discounts');
    cy.contains('Réductions & Promotions').should('be.visible');
  });

  it('affiche le menu mobile sur les petits écrans', () => {
    // Redimensionner la fenêtre pour simuler un mobile
    cy.viewport(768, 1024);

    // Vérifier que le menu hamburger est visible
    cy.get('[data-testid="menu-button"]').should('be.visible');

    // Ouvrir le menu mobile
    cy.get('[data-testid="menu-button"]').click();

    // Vérifier que les liens de navigation sont visibles
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Products').should('be.visible');
    cy.contains('Orders').should('be.visible');
    cy.contains('Analytics').should('be.visible');
    cy.contains('Discounts').should('be.visible');
  });

  it('garde la navigation active sur la page courante', () => {
    // Aller sur la page Products
    cy.contains('Products').click();
    cy.url().should('include', '/products');

    // Vérifier que le lien Products est actif
    cy.contains('Products').should('have.class', 'active');

    // Aller sur la page Analytics
    cy.contains('Analytics').click();
    cy.url().should('include', '/analytics');

    // Vérifier que le lien Analytics est actif
    cy.contains('Analytics').should('have.class', 'active');
  });

  it('affiche le logo et le titre de l\'application', () => {
    // Vérifier que le logo est présent
    cy.get('[data-testid="logo"]').should('be.visible');

    // Vérifier que le titre de l'application est affiché
    cy.contains('GUERLAIN PARIS').should('be.visible');
  });

  it('affiche les icônes de notification et de profil', () => {
    // Vérifier que l'icône de notification est présente
    cy.get('[data-testid="notification-icon"]').should('be.visible');

    // Vérifier que l'icône de profil est présente
    cy.get('[data-testid="profile-icon"]').should('be.visible');
  });
}); 