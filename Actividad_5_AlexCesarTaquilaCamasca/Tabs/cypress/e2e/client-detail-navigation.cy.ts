describe('Client detail navigation', () => {
  it('should open client detail and show the selected client ID', () => {
    cy.visit('/');
    cy.get('ion-tab-button[tab="clients"]', { timeout: 10000 }).click();
    
    cy.get('ion-item.client-item').first().click();
    cy.url().should('match', /\/clients\/\d+$/);
    
    cy.url().then((url) => {
      const clientId = url.split('/').pop();
      cy.contains('.client-id', `ID: ${clientId}`).should('exist');
    });
  });

  it('should go back to clients when using back button after tab navigation', () => {
    cy.visit('/');
    cy.get('ion-tab-button[tab="clients"]', { timeout: 10000 }).click();

    cy.get('ion-item.client-item').first().click();
    cy.get('ion-back-button.custom:visible').first().click({ force: true });

    cy.url().should('include', '/clients');
    cy.get('ion-item.client-item').should('have.length.greaterThan', 0);
  });

  it('should use defaultHref and go to clients when opening detail directly', () => {
    cy.visit('/clients/2');
    cy.get('ion-back-button.custom:visible', { timeout: 10000 }).first().click({ force: true });

    cy.url().should('include', '/clients');
  });
});
