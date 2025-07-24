describe('Gestion des Produits E2E', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('affiche la liste des produits', () => {
    // Vérifier que la page se charge
    cy.contains('Gestion des produits').should('be.visible');

    // Vérifier que la barre de recherche est présente
    cy.get('input[placeholder*="Rechercher"]').should('be.visible');

    // Vérifier que le bouton d'ajout est présent
    cy.contains('Ajouter un produit').should('be.visible');
  });

  it('peut rechercher des produits', () => {
    // Saisir une recherche
    cy.get('input[placeholder*="Rechercher"]').type('Crème');

    // Vérifier que la recherche fonctionne
    cy.get('input[placeholder*="Rechercher"]').should('have.value', 'Crème');
  });

  it('peut ajouter un nouveau produit', () => {
    // Cliquer sur le bouton d'ajout
    cy.contains('Ajouter un produit').click();

    // Vérifier qu'on est sur la page d'ajout
    cy.url().should('include', '/products/addProducts');

    // Remplir le formulaire
    cy.get('input[name="name"]').type('Nouveau Produit Test');
    cy.get('input[name="price"]').type('29.99');
    cy.get('textarea[name="description"]').type('Description du nouveau produit');

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifier le message de succès
    cy.contains('Produit créé avec succès').should('be.visible');
  });

  it('peut modifier un produit existant', () => {
    // Cliquer sur le bouton d'édition du premier produit
    cy.get('[data-testid="edit-button"]').first().click();

    // Vérifier qu'on est sur la page d'édition
    cy.url().should('include', '/products/edit');

    // Modifier le nom du produit
    cy.get('input[name="name"]').clear().type('Produit Modifié');

    // Sauvegarder les modifications
    cy.get('button[type="submit"]').click();

    // Vérifier le message de succès
    cy.contains('Produit modifié avec succès').should('be.visible');
  });

  it('peut supprimer un produit', () => {
    // Cliquer sur le bouton de suppression du premier produit
    cy.get('[data-testid="delete-button"]').first().click();

    // Confirmer la suppression
    cy.get('[data-testid="confirm-delete"]').click();

    // Vérifier le message de succès
    cy.contains('Produit supprimé avec succès').should('be.visible');
  });

  it('affiche les détails d\'un produit', () => {
    // Cliquer sur un produit pour voir ses détails
    cy.get('[data-testid="product-card"]').first().click();

    // Vérifier que les détails sont affichés
    cy.contains('Détails du produit').should('be.visible');
    cy.get('[data-testid="product-name"]').should('be.visible');
    cy.get('[data-testid="product-price"]').should('be.visible');
    cy.get('[data-testid="product-description"]').should('be.visible');
  });

  it('filtre les produits par catégorie', () => {
    // Sélectionner une catégorie dans le filtre
    cy.get('[data-testid="category-filter"]').click();
    cy.contains('Skincare').click();

    // Vérifier que le filtre est appliqué
    cy.get('[data-testid="category-filter"]').should('contain', 'Skincare');
  });

  it('trie les produits par prix', () => {
    // Cliquer sur le tri par prix
    cy.get('[data-testid="sort-price"]').click();

    // Vérifier que le tri est appliqué
    cy.get('[data-testid="sort-price"]').should('have.class', 'active');
  });
}); 