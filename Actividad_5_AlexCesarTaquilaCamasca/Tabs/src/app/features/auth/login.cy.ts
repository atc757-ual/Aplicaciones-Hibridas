import { LoginPage } from './login.page';

describe('LoginPage', () => {
  beforeEach(() => {
    cy.mount(LoginPage);
  });

  it('should create', () => {
    cy.get('ion-card.login-card').should('exist');
  });

  it('should render the welcome message and mobile input', () => {
    cy.contains('h1', '¡Hola, bienvenido!').should('exist');
    cy.get('ion-input[formcontrolname="mobile"]').should('exist');
  });

  it('should keep the continue button disabled with an invalid mobile', () => {
    cy.get('ion-input[formcontrolname="mobile"] input').type('511223344');
    cy.get('body').click(0, 0);
    cy.contains('ion-button.contain-button', 'Continuar').should('have.attr', 'disabled');
    cy.contains('.validation-text', 'El móvil ingresado no es válido.').should('exist');
  });

  it('should enable the continue button with a valid mobile', () => {
    cy.get('ion-input[formcontrolname="mobile"] input').type('612345678');
    cy.contains('ion-button.contain-button', 'Continuar').should('not.have.attr', 'disabled');
  });

  it('should show the OTP step after clicking Continuar with a valid mobile', () => {
    cy.get('ion-input[formcontrolname="mobile"] input').type('612345678');
    cy.contains('ion-button.contain-button', 'Continuar').click({ force: true });

    cy.wait(1100);
    cy.contains('p.code-title', 'Ingresa código de verificación').should('exist');
    cy.contains('.code-label', 'Enviado vía SMS al xxxxx5678').should('exist');
    cy.get('ion-input-otp').should('exist');
    cy.get('.back ion-icon').should('exist');
  });

  it('should advance and call navigation when OTP has 6 digits', () => {
    cy.mount(LoginPage).then((wrapper) => {
      const component = wrapper.component as any;
      cy.spy(component['navController'], 'navigateRoot').as('navigateRoot');

      component.loginForm.get('mobile')?.setValue('612345678');
      cy.wrap(component.goToCodeStep()).then(() => {
        wrapper.fixture.detectChanges();
        cy.get('ion-input-otp').should('exist');

        return cy.wrap(component.onOtpChange({ detail: { value: '123456' } }));
      }).then(() => {
        cy.wait(950);
        cy.get('@navigateRoot').should('have.been.calledWith', '/reservations');
      });
    });
  });
});
