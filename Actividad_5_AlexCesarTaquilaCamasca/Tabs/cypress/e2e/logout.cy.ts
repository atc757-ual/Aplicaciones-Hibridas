describe('Logout flow', () => {
  it('should redirect to login when clicking Cerrar Sesion', () => {
    cy.visit('/');

    cy.get('ion-tab-button[tab="products"]', { timeout: 10000 }).should('exist').click();
    cy.url().should('not.include', '/home');
    cy.url().should('include', '/products');
    cy.get('.contain-logout ion-button', { timeout: 10000 }).should('exist');

    cy.get('.contain-logout ion-button').click({ force: true });

    cy.url().should('include', '/login');
    cy.contains('h1', '¡Hola, bienvenido!').should('exist');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('reservations-data')).to.be.null;
    });
  });
});
