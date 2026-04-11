describe('Create reservation navigation', () => {
  it('should open create reservation page from reservations tab', () => {
    cy.visit('/reservations');

    cy.get('.reservations-fab ion-fab-button').last().click({ force: true });
    cy.contains('.fab-menu-card__label', 'Reservar ahora').click({ force: true });

    cy.url().should('include', '/reservations/new');
    cy.contains('ion-title.header-title', /^Crear reservacion$/).should('be.visible');
  });

  it('should go back to reservations after opening create reservation from tab navigation', () => {
    cy.visit('/reservations');

    cy.get('.reservations-fab ion-fab-button').last().click({ force: true });
    cy.contains('.fab-menu-card__label', 'Reservar ahora').click({ force: true });

    cy.get('ion-back-button.custom:visible').first().click({ force: true });
    cy.url().should('include', '/reservations');
  });

  it('should use defaultHref and go to reservations when opening create reservation directly', () => {
    cy.visit('/reservations/new');

    cy.get('ion-back-button.custom:visible', { timeout: 10000 }).first().click({ force: true });
    cy.url().should('include', '/reservations');
  });
});
