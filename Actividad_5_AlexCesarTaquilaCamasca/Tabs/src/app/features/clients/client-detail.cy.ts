import { ClientDetailPage } from './client-detail.page';

describe('ClientDetailPage', () => {
  it('should render client detail when id input is valid', () => {
    cy.mount(ClientDetailPage, {
      componentProperties: { id: '1' },
    });

    cy.get('ion-title.header-title').should('have.text', 'Detalle de cliente');
    cy.get('.client-name').should('not.be.empty');
    cy.get('.client-role').should('not.be.empty');
    cy.get('.status-badge').invoke('text').then((text) => {
      expect(text.trim()).to.match(/^(Activo|Inactivo)$/);
    });
    cy.get('.info-list ion-item').should('have.length', 5);
  });

  it('should render the client image with src and alt', () => {
    cy.mount(ClientDetailPage, {
      componentProperties: { id: '1' },
    });

    cy.get('.profile-header img')
      .should('have.attr', 'src')
      .and('not.be.empty');
    cy.get('.profile-header img')
      .should('have.attr', 'alt')
      .and('not.be.empty');
  });

  it('should render the detail icons and labels', () => {
    cy.mount(ClientDetailPage, {
      componentProperties: { id: '1' },
    });

    cy.get('.info-list ion-item ion-icon').then(($icons) => {
      const names = [...$icons].map((icon) => icon.getAttribute('name'));
      expect(names).to.deep.equal([
        'mail-outline',
        'call-outline',
        'business-outline',
        'location-outline',
        'calendar-outline',
      ]);
    });

    cy.get('.info-list ion-item ion-label p').then(($labels) => {
      const texts = [...$labels].map((label) => label.textContent?.trim());
      expect(texts).to.deep.equal([
        'Email',
        'Móvil',
        'Deparamento',
        'Ubicación',
        'Fecha de incorporación',
      ]);
    });
  });

  it('should render all detail values for the selected client', () => {
    cy.mount(ClientDetailPage, {
      componentProperties: { id: '1' },
    }).then((wrapper) => {
      const selectedClient = (wrapper.component as any)['client'];

      cy.get('.info-list ion-item ion-label h3').should('have.length', 5);
      cy.get('.info-list ion-item ion-label h3').then(($values) => {
        const values = [...$values].map((value) => value.textContent?.trim());
        expect(values).to.deep.equal([
          selectedClient.email,
          selectedClient.phone,
          selectedClient.department,
          selectedClient.location,
          selectedClient.joinDate,
        ]);
      });
    });
  });

  it('should render not-found state when id input is invalid', () => {
    cy.mount(ClientDetailPage, {
      componentProperties: { id: '9999' },
    });

    cy.contains('.not-found p', 'Cliente no encontrado').should('exist');
  });
});
