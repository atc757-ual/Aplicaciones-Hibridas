import { Tabs } from './tabs';

describe('Tabs', () => {
  beforeEach(() => {
    cy.mount(Tabs).then((wrapper) => {
      expect(wrapper.component).not.to.be.undefined;
    });
  });

  it('should create', () => {
    cy.get('ion-tabs').should('exist');
  });

  const cases = [
    { tab: 'clients', label: 'Clients', icon: 'people' },
    { tab: 'reservations', label: 'Reservations', icon: 'calendar' },
    { tab: 'products', label: 'Products', icon: 'bag' },
  ];

  cases.forEach((item) => {
    it(`should show correct label and icon for ${item.tab} tab`, () => {
      cy.get(`ion-tab-button[tab="${item.tab}"]`).within(() => {
        cy.get('ion-label').invoke('text').then((text) => {
          expect(text.trim()).to.eq(item.label);
        });

        cy.get('ion-icon').should('have.attr', 'name', item.icon);
      });
    });
  });
});
