import { ProductsPage } from './products.page';

describe('ProductsPage', () => {
  beforeEach(() => {
    cy.mount(ProductsPage);
  });

  it('should create', () => {
    cy.get('ion-content').should('exist');
  });

  it('should render the products header title', () => {
    cy.get('ion-title.header-title').should('have.text', 'Productos');
  });

  it('should render the products banner content', () => {
    cy.get('.banner-title').should('have.text', 'Lo mejor de la tecnología');
    cy.get('.banner-detail').should('have.text', 'Descubre productos exclusivos y ofertas especiales para ti.');
  });

  it('should render 4 products by default', () => {
    cy.get('.product-card').should('have.length', 4);
  });

  it('should render the full structure of the first product card', () => {
    cy.get('.product-card').first().within(() => {
      cy.get('.product-name').should('not.be.empty');
      cy.get('.original-price').should('contain.text', '€');
      cy.get('.current-price').should('contain.text', '€');
      cy.get('.discount-badge').invoke('text').should('include', '% OFF');
      cy.get('img').should('have.attr', 'alt').and('not.be.empty');
      cy.get('img').should('have.attr', 'src').and('not.be.empty');
    });
  });

  it('should render the free shipping badge for products that have it', () => {
    cy.get('.product-card').then(($cards) => {
      const freeShippingCount = [...$cards].filter((card) => card.querySelector('.free-shipping')).length;
      cy.get('.free-shipping').its('length').should('eq', freeShippingCount);
      cy.get('.free-shipping').its('length').should('be.greaterThan', 0);
    });
  });

  it('should show more products after clicking "Ver más productos"', () => {
    cy.contains('ion-button', 'Ver más productos').click({ force: true });
    cy.get('.product-card').its('length').should('be.greaterThan', 4);
  });

  it('should change the toggle label after showing all products', () => {
    cy.contains('ion-button', 'Ver más productos').should('exist');
    cy.contains('ion-button', 'Ver más productos').click({ force: true });
    cy.contains('ion-button', 'Ver menos productos').should('exist');
  });

  it('should render the logout button', () => {
    cy.contains('ion-button', 'Cerrar Sesión').should('exist');
  });
});



