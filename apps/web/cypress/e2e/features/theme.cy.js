describe('Tests du thème', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('peut changer de thème', () => {
    // Vérifier que le mode clair est actif par défaut
    cy.checkLightMode();

    // Changer vers le mode sombre
    cy.toggleTheme();
    cy.checkDarkMode();

    // Changer vers le mode clair
    cy.toggleTheme();
    cy.checkLightMode();
  });

  it('persiste le thème après rechargement', () => {
    // Changer vers le mode sombre
    cy.toggleTheme();
    cy.checkDarkMode();

    // Recharger la page
    cy.reload();

    // Vérifier que le mode sombre est toujours actif
    cy.checkDarkMode();
  });

  it('applique le thème sur toutes les pages', () => {
    // Changer vers le mode sombre
    cy.toggleTheme();
    cy.checkDarkMode();

    // Naviguer vers Analytics
    cy.navigateTo('Analytics');
    cy.checkDarkMode();

    // Naviguer vers Discounts
    cy.navigateTo('Discounts');
    cy.checkDarkMode();

    // Naviguer vers Products
    cy.navigateTo('Products');
    cy.checkDarkMode();
  });
}); 