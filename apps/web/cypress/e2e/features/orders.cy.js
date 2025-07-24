describe('Gestion des Commandes E2E', () => {
  beforeEach(() => {
    cy.visit('/orders');
  });

  it('affiche la liste des commandes', () => {
    // Vérifier que la page se charge
    cy.contains('Gestion des commandes').should('be.visible');

    // Vérifier que les filtres sont présents
    cy.get('[data-testid="status-filter"]').should('be.visible');
    cy.get('[data-testid="date-filter"]').should('be.visible');
  });

  it('peut filtrer les commandes par statut', () => {
    // Sélectionner un statut
    cy.get('[data-testid="status-filter"]').click();
    cy.contains('En cours').click();

    // Vérifier que le filtre est appliqué
    cy.get('[data-testid="status-filter"]').should('contain', 'En cours');
  });

  it('peut voir les détails d\'une commande', () => {
    // Cliquer sur une commande pour voir ses détails
    cy.get('[data-testid="order-row"]').first().click();

    // Vérifier que les détails sont affichés
    cy.contains('Détails de la commande').should('be.visible');
    cy.get('[data-testid="order-id"]').should('be.visible');
    cy.get('[data-testid="customer-info"]').should('be.visible');
    cy.get('[data-testid="order-items"]').should('be.visible');
  });

  it('peut changer le statut d\'une commande', () => {
    // Ouvrir le menu d'actions d'une commande
    cy.get('[data-testid="order-actions"]').first().click();

    // Changer le statut
    cy.contains('Marquer comme expédiée').click();

    // Vérifier le message de succès
    cy.contains('Statut mis à jour avec succès').should('be.visible');
  });

  it('peut rechercher des commandes', () => {
    // Saisir une recherche
    cy.get('input[placeholder*="Rechercher"]').type('12345');

    // Vérifier que la recherche fonctionne
    cy.get('input[placeholder*="Rechercher"]').should('have.value', '12345');
  });

  it('affiche les statistiques des commandes', () => {
    // Vérifier que les statistiques sont affichées
    cy.get('[data-testid="orders-stats"]').should('be.visible');
    cy.get('[data-testid="total-orders"]').should('be.visible');
    cy.get('[data-testid="pending-orders"]').should('be.visible');
    cy.get('[data-testid="completed-orders"]').should('be.visible');
  });
}); 