import { CreateReservationPage } from './create-reservation.page';

describe('CreateReservationPage', () => {
  beforeEach(() => {
    cy.mount(CreateReservationPage);
  });

  it('should create', () => {
    cy.get('ion-content').should('exist');
  });

  it('should render the create reservation header title', () => {
    cy.get('ion-title.header-title').should('have.text', 'Crear reservacion');
  });

  it('should keep destination disabled until origin is selected', () => {
    cy.get('.custom-select').eq(1).find('.custom-select__trigger').should('be.disabled');
  });

  it('should render the preview card and save button after completing the three fields', () => {
    cy.get('.custom-select').eq(0).find('.custom-select__trigger').click();
    cy.get('.custom-select').eq(0).find('.custom-select__option').first().then(($originOption) => {
      const originText = $originOption.text().trim();
      cy.wrap($originOption).click();

      cy.get('.custom-select').eq(1).find('.custom-select__option').first().then(($destinationOption) => {
        const destinationText = $destinationOption.text().trim();
        cy.wrap($destinationOption).click();

        cy.get('#travel-date').then(($input) => {
          const minDate = $input.attr('min');
          if (!minDate) {
            throw new Error('Expected #travel-date to have a min attribute');
          }
          cy.get('#travel-date').clear().type(minDate).blur();

          cy.get('.flight-preview').should('exist');
          cy.get('.flight-preview .route-code').then(($codes) => {
            expect($codes.eq(0).text().trim()).to.not.be.empty;
            expect($codes.eq(1).text().trim()).to.not.be.empty;
          });
          cy.get('.flight-preview .time-main').its('length').should('eq', 2);
          cy.get('.flight-preview .city-name').then(($cities) => {
            expect($cities.eq(0).text().trim()).to.eq(originText);
            expect($cities.eq(1).text().trim()).to.eq(destinationText);
          });
          cy.get('.flight-preview .flight-meta').its('length').should('eq', 2);
          cy.contains('.actions-panel', 'La reserva se agregará a tu lista principal al confirmar.').should('exist');
          cy.get('ion-button.submit-button')
            .invoke('text')
            .then((text) => text.replace(/\s+/g, ' ').trim())
            .should('eq', 'Guardar reservacion');
        });
      });
    });
  });

  it('should render preview card with exact selected flight fields', () => {
    cy.mount(CreateReservationPage).then((wrapper) => {
      const component = wrapper.component as any;
      const firstFlight = component.flightOptions[0];

      component.form.controls['origen'].setValue(firstFlight.origen);
      component.form.controls['destino'].setValue(firstFlight.destino);
      component.form.controls['fechaViaje'].setValue(firstFlight.fechaViaje);
      wrapper.fixture.detectChanges();

      cy.wrap(firstFlight).as('firstFlight');
    });

    cy.get('@firstFlight').then((flight: any) => {
      cy.get('.flight-preview .route-code').eq(0).should('have.text', flight.codIataOrigen);
      cy.get('.flight-preview .route-code').eq(1).should('have.text', flight.codIataDestino);
      cy.get('.flight-preview .time-main').eq(0).should('have.text', flight.horaSalida);
      cy.get('.flight-preview .time-main').eq(1).should('have.text', flight.horaLlegada);
      cy.get('.flight-preview .city-name').eq(0).should('have.text', flight.origen);
      cy.get('.flight-preview .city-name').eq(1).should('have.text', flight.destino);
      cy.get('.flight-preview .flight-meta').eq(0).should('have.text', flight.aerolinea);
      cy.get('.flight-preview .flight-meta').eq(1).should('have.text', '11/04/2026');
      cy.get('ion-button.submit-button').should('exist');
    });
  });

  it('should show the save button only after the form is complete', () => {
    cy.get('.custom-select').eq(0).find('.custom-select__trigger').click();
    cy.get('.custom-select').eq(0).find('.custom-select__option').first().click();

    cy.get('.custom-select').eq(1).find('.custom-select__option').first().click();

    cy.get('#travel-date').then(($input) => {
      const minDate = $input.attr('min');
      if (!minDate) {
        throw new Error('Expected #travel-date to have a min attribute');
      }
      cy.get('#travel-date').clear().type(minDate);
    });

    cy.contains('ion-button.submit-button', 'Guardar reservacion').should('exist');
  });
});
