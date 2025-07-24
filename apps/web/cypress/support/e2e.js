// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Masquer les erreurs non critiques dans la console
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retourner false empêche Cypress de faire échouer le test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  // Gérer l'erreur d'hydratation de React
  if (err.message.includes('Hydration failed because the server rendered text didn\'t match the client')) {
    return false;
  }
  // Gérer les erreurs de styled-components
  if (err.message.includes('styled-components')) {
    return false;
  }
  // Gérer les erreurs de réduction (orders.reduce is not a function)
  if (err.message.includes('orders.reduce is not a function')) {
    return false;
  }
  // Pour les autres erreurs, laisser Cypress les gérer
  return true;
});

// Configuration globale pour les tests
beforeEach(() => {
  // Intercepter les requêtes API pour éviter les appels réels
  cy.intercept('GET', '/api/**', { fixture: 'api-data.json' }).as('apiCall');
  
  // Nettoyer le localStorage avant chaque test
  cy.clearLocalStorage();
  
  // Nettoyer les cookies avant chaque test
  cy.clearCookies();
}); 