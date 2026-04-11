import { ClientsPage } from './clients.page';

describe('ClientsPage', () => {
  beforeEach(() => {
    cy.mount(ClientsPage);
  });

  it('should create', () => {
    cy.get('ion-content').should('exist');
  });

  it('should render the header title', () => {
    cy.get('ion-title.header-title').should('have.text', 'Clientes');
  });

  it('should render the searchbar for filtering employees', () => {
    cy.get('ion-searchbar.clients-searchbar').should('exist');
  });

  it('should render a result count with the total clients', () => {
    cy.get('.results-count')
      .invoke('text')
      .then((text) => text.replace(/\s+/g, ' ').trim())
      .should('match', /^\d+ Empleado(s)?$/);
  });

  it('should render at least one client item', () => {
    cy.get('ion-item.client-item').should('have.length.greaterThan', 0);
  });

  it('should render one list item per client from service data', () => {
    cy.mount(ClientsPage).then((wrapper) => {
      const component = wrapper.component as any;
      cy.wrap(component.clients.length).as('expectedClientsCount');
    });

    cy.get('@expectedClientsCount').then((expectedClientsCount) => {
      cy.get('ion-item.client-item').should('have.length', Number(expectedClientsCount));
    });
  });

  it('should render the structure of the first client item', () => {
    cy.get('ion-item.client-item').first().within(() => {
      cy.get('ion-label h2').should('not.be.empty');
      cy.get('ion-label p').should('not.be.empty');
      cy.get('ion-avatar img').then(($img) => {
        expect($img.attr('src')).to.be.a('string').and.not.be.empty;
        expect($img.attr('alt')).to.be.a('string').and.not.be.empty;
      });
      cy.get('.status-dot').should('exist');
    });
  });

  it('should render each client name, role-department, image and status from service data', () => {
    cy.mount(ClientsPage).then((wrapper) => {
      const component = wrapper.component as any;
      const expectedClients = component.clients;

      cy.get('ion-item.client-item').should('have.length', expectedClients.length);
      cy.get('ion-item.client-item').each(($item, index) => {
        const expected = expectedClients[index];
        cy.wrap($item).find('ion-label h2').invoke('text').should((text) => {
          expect(text.trim()).to.eq(expected.name);
        });
        cy.wrap($item).find('ion-label p').invoke('text').should((text) => {
          expect(text.trim()).to.eq(`${expected.role} · ${expected.department}`);
        });
        cy.wrap($item).find('ion-avatar img').should('have.attr', 'src', expected.img);
        cy.wrap($item).find('ion-avatar img').should('have.attr', 'alt', expected.name);
        cy.wrap($item).find('.status-dot').should(expected.status === 'activo' ? 'have.class' : 'not.have.class', 'active');
      });
    });
  });

  it('should filter employees when searching by name', () => {
    cy.mount(ClientsPage).then((wrapper) => {
      const component = wrapper.component as any;
      const searchTerm = component.clients[0].name;

      component.onSearch({ detail: { value: searchTerm } } as any);
      wrapper.fixture.detectChanges();

      const expectedCount = component.filteredClients.length;
      cy.wrap(searchTerm.toLowerCase()).as('searchTerm');
      cy.wrap(expectedCount).as('expectedCount');
    });

    cy.get('@expectedCount').then((expectedCount) => {
      cy.get('ion-item.client-item').should('have.length', Number(expectedCount));
    });

    cy.get('@searchTerm').then((searchTerm) => {
      cy.get('ion-item.client-item ion-label h2').each(($title) => {
        expect($title.text().toLowerCase()).to.include(String(searchTerm).toLowerCase());
      });
    });
  });

  it('should filter employees when searching by role', () => {
    cy.mount(ClientsPage).then((wrapper) => {
      const component = wrapper.component as any;
      const role = component.clients[0].role;

      component.onSearch({ detail: { value: role } } as any);
      wrapper.fixture.detectChanges();

      const expectedCount = component.filteredClients.length;
      cy.wrap(role.toLowerCase()).as('role');
      cy.wrap(expectedCount).as('expectedCountByRole');
    });

    cy.get('@expectedCountByRole').then((expectedCount) => {
      cy.get('ion-item.client-item').should('have.length', Number(expectedCount));
    });

    cy.get('@role').then((role) => {
      cy.get('ion-item.client-item').each(($item) => {
        cy.wrap($item).find('ion-label p').invoke('text').should((text) => {
          expect(text.toLowerCase()).to.include(String(role));
        });
      });
    });
  });

  it('should render status dot active class according to each client status', () => {
    cy.mount(ClientsPage).then((wrapper) => {
      const component = wrapper.component as any;
      const expectedStatus = component.clients.map((client: any) => client.status === 'activo');
      cy.get('ion-item.client-item .status-dot').each(($dot, index) => {
        const shouldBeActive = expectedStatus[index];
        expect($dot.hasClass('active')).to.eq(shouldBeActive);
      });
    });
  });
});
