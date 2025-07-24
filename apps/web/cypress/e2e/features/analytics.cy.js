describe('Analytics E2E', () => {
  beforeEach(() => {
    cy.visit('/analytics');
  });

  it('affiche la page Analytics avec tous les composants', () => {
    // Vérifier que la page se charge
    cy.contains('Analytics').should('be.visible');
    cy.contains('Analyze your business performance').should('be.visible');

    // Vérifier que les cartes Analytics sont présentes
    cy.contains('Sales Trends').should('be.visible');
    cy.contains('Top Selling Products').should('be.visible');
    cy.contains('Sales by Category').should('be.visible');
    cy.contains('Export Functionality').should('be.visible');
  });

  it('peut changer la période d\'analyse', () => {
    // Changer la période vers Weekly
    cy.contains('Weekly').click();
    cy.contains('Weekly').should('have.class', 'active');

    // Changer la période vers Daily
    cy.contains('Daily').click();
    cy.contains('Daily').should('have.class', 'active');
  });

  it('peut exporter les données', () => {
    // Sélectionner le type de données
    cy.contains('Toutes les données').click();

    // Sélectionner le format d'export
    cy.contains('CSV').click();

    // Cliquer sur Exporter
    cy.contains('Exporter').click();

    // Vérifier le message de succès
    cy.contains('Export en cours').should('be.visible');
  });

  it('peut planifier un export', () => {
    // Cliquer sur Planifier
    cy.contains('Planifier').click();

    // Vérifier que le modal de planification s'ouvre
    cy.contains('Planifier un export').should('be.visible');
  });

  it('affiche les métriques de vente', () => {
    // Vérifier que les métriques sont affichées
    cy.contains('€263,6').should('be.visible');
    cy.contains('Last 30 Days +0%').should('be.visible');
  });

  it('affiche les graphiques', () => {
    // Vérifier que les zones de graphiques sont présentes
    cy.get('[data-testid="sales-chart"]').should('be.visible');
    cy.get('[data-testid="products-chart"]').should('be.visible');
    cy.get('[data-testid="category-chart"]').should('be.visible');
  });

  it('peut filtrer les données par catégorie', () => {
    // Sélectionner une catégorie dans le filtre
    cy.get('[data-testid="category-filter"]').click();
    cy.contains('Skincare').click();

    // Vérifier que le filtre est appliqué
    cy.get('[data-testid="category-filter"]').should('contain', 'Skincare');
  });
}); 