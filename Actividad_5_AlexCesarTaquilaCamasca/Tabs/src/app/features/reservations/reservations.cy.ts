import { ReservationsPage } from './reservations.page';
import { ReservationsService } from '../../core/services/reservations.service';
import { BehaviorSubject } from 'rxjs';

describe('ReservationsPage', () => {
  beforeEach(() => {
    cy.mount(ReservationsPage);
  });

  it('should create', () => {
    cy.get('ion-content').should('exist');
  });

  it('should render the reservations header with title', () => {
    cy.get('ion-title.header-title').should('have.text', 'Mis reservaciones');
  });

  it('should render pending reservations count text', () => {
    cy.get('.results-count')
      .invoke('text')
      .then((text) => text.replace(/\s+/g, ' ').trim())
      .should('match', /^\d+ Reservas pendientes$/);
  });

  it('should render at least one reservation card', () => {
    cy.get('.premium-card').its('length').should('be.greaterThan', 0);
  });

  it('should render all main fields inside the first reservation card', () => {
    cy.get('.premium-card').first().within(() => {
      cy.get('.route-code').its('length').should('eq', 2);
      cy.get('.plane-icon').should('exist');
      cy.get('.time-main').its('length').should('eq', 2);
      cy.get('.city-name').its('length').should('eq', 2);
      cy.get('.info-label').then(($labels) => {
        const labels = [...$labels].map((label) => label.textContent?.trim());
        expect(labels).to.deep.equal(['Vuelo', 'Aerolínea']);
      });
      cy.get('.footer-icon').should('exist');
      cy.get('.reservation-code').should('not.be.empty');
      cy.get('.flight-date').should('exist');
      cy.get('.status-badge').should('exist');
    });
  });

  it('should render the floating action button to create reservations', () => {
    cy.get('.reservations-fab ion-fab-button').should('exist');
  });

  it('should show the past reservations toggle only when past reservations exist', () => {
    cy.get('.past-toggle-button').should('exist');
    cy.get('.past-toggle-button span').invoke('text').should('match', /Mostrar reservas pasadas|Ocultar reservas pasadas/);
  });

  it('should show past reservations when toggled', () => {
    cy.get('.past-toggle-button').click();
    cy.get('.past-toggle-button span').should('have.text', 'Ocultar reservas pasadas');
    cy.get('.premium-card--past').its('length').should('be.greaterThan', 0);
  });

  it('should expand a reservation card when clicked', () => {
    cy.get('.premium-card').first().as('firstCard');
    cy.get('@firstCard').should('have.attr', 'aria-expanded', 'false');
    cy.get('@firstCard').click();
    cy.get('@firstCard').should('have.attr', 'aria-expanded', 'true');
  });

  it('should render empty state when there are no reservations', () => {
    const emptyReservationsService = {
      reservations$: new BehaviorSubject([]).asObservable(),
    } as Partial<ReservationsService>;

    cy.mount(ReservationsPage, {
      providers: [
        {
          provide: ReservationsService,
          useValue: emptyReservationsService,
        },
      ],
    });

    cy.contains('.empty-state p', 'No hay reservaciones todavía').should('exist');
  });
});
