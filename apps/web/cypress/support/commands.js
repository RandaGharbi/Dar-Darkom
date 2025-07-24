// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Commande pour se connecter
Cypress.Commands.add('login', (email = 'admin@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Commande pour changer le thème
Cypress.Commands.add('toggleTheme', () => {
  cy.get('[data-testid="theme-toggle"]').click();
});

// Commande pour naviguer vers une page
Cypress.Commands.add('navigateTo', (page) => {
  cy.contains(page).click();
  cy.url().should('include', page.toLowerCase());
});

// Commande pour vérifier qu'un élément est visible
Cypress.Commands.add('shouldBeVisible', (selector) => {
  cy.get(selector).should('be.visible');
});

// Commande pour attendre qu'une requête API soit terminée
Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(`@${alias}`);
});

// Commande pour vérifier le mode sombre
Cypress.Commands.add('checkDarkMode', () => {
  cy.get('body').should('have.css', 'background-color', 'rgb(26, 26, 26)');
});

// Commande pour vérifier le mode clair
Cypress.Commands.add('checkLightMode', () => {
  cy.get('body').should('have.css', 'background-color', 'rgb(255, 255, 255)');
});

// Commande pour créer un produit de test
Cypress.Commands.add('createTestProduct', (productData) => {
  cy.visit('/products/addProducts');
  cy.get('input[name="name"]').type(productData.name);
  cy.get('input[name="price"]').type(productData.price);
  cy.get('textarea[name="description"]').type(productData.description);
  cy.get('button[type="submit"]').click();
  cy.contains('Produit créé avec succès').should('be.visible');
});

// Commande pour supprimer un produit
Cypress.Commands.add('deleteProduct', (productName) => {
  cy.contains(productName).parent().find('[data-testid="delete-button"]').click();
  cy.get('[data-testid="confirm-delete"]').click();
  cy.contains('Produit supprimé avec succès').should('be.visible');
}); 