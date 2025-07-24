describe('Exemple E2E web', () => {
  it('affiche la page d\'accueil', () => {
    cy.visit('/');
    cy.contains('Accueil'); // À adapter selon le contenu réel
  });
}); 