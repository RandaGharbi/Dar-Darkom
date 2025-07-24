describe('Dashboard E2E', () => {
  beforeEach(() => {
    // Visiter la page d'accueil avant chaque test
    cy.visit('/');
  });

  it('affiche la page d\'accueil avec les éléments principaux', () => {
    // Vérifier que la page se charge
    cy.get('body').should('be.visible');
    
    // Vérifier la présence d'éléments de navigation
    cy.get('nav').should('exist');
    
    // Vérifier le contenu principal
    cy.contains('Dashboard').should('be.visible');
  });

  it('peut naviguer vers la page des produits', () => {
    // Cliquer sur le lien des produits (ajuste selon ton app)
    cy.contains('Produits').click();
    
    // Vérifier qu'on est sur la bonne page
    cy.url().should('include', '/products');
    cy.contains('Gestion des produits').should('be.visible');
  });

  it('peut naviguer vers la page des commandes', () => {
    // Cliquer sur le lien des commandes
    cy.contains('Commandes').click();
    
    // Vérifier qu'on est sur la bonne page
    cy.url().should('include', '/orders');
    cy.contains('Gestion des commandes').should('be.visible');
  });

  it('peut se connecter avec des identifiants valides', () => {
    // Aller à la page de connexion
    cy.visit('/login');
    
    // Remplir le formulaire de connexion
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();
    
    // Vérifier qu'on est redirigé vers le dashboard
    cy.url().should('include', '/dashboard');
  });
}); 