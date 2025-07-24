describe('ThemeToggle Component E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('affiche le bouton de changement de thème', () => {
    // Vérifier que le bouton est présent
    cy.get('[data-testid="theme-toggle"]').should('be.visible');
  });

  it('change de thème quand on clique dessus', () => {
    // Vérifier le thème initial (clair)
    cy.checkLightMode();

    // Cliquer sur le bouton de thème
    cy.get('[data-testid="theme-toggle"]').click();

    // Vérifier que le thème a changé (sombre)
    cy.checkDarkMode();

    // Cliquer à nouveau pour revenir au thème clair
    cy.get('[data-testid="theme-toggle"]').click();
    cy.checkLightMode();
  });

  it('persiste le thème après rechargement', () => {
    // Changer vers le thème sombre
    cy.get('[data-testid="theme-toggle"]').click();
    cy.checkDarkMode();

    // Recharger la page
    cy.reload();

    // Vérifier que le thème sombre est toujours actif
    cy.checkDarkMode();
  });

  it('affiche l\'icône appropriée selon le thème', () => {
    // En mode clair, vérifier l'icône de lune
    cy.get('[data-testid="theme-toggle"]').should('contain', '🌙');

    // Changer vers le mode sombre
    cy.get('[data-testid="theme-toggle"]').click();

    // En mode sombre, vérifier l'icône de soleil
    cy.get('[data-testid="theme-toggle"]').should('contain', '☀️');
  });

  it('applique le thème sur toute l\'application', () => {
    // Changer vers le thème sombre
    cy.get('[data-testid="theme-toggle"]').click();

    // Naviguer vers différentes pages pour vérifier que le thème est appliqué
    cy.contains('Products').click();
    cy.checkDarkMode();

    cy.contains('Analytics').click();
    cy.checkDarkMode();

    cy.contains('Discounts').click();
    cy.checkDarkMode();
  });
}); 