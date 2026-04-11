import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';

import { LoginPage } from './login.page';

const _expect = (globalThis as any).expect as any;

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const navControllerMock = {
    navigateRoot: () => undefined,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [{ provide: NavController, useValue: navControllerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    _expect(component).toBeTruthy();
  });

  it('should render the welcome message and mobile input', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const welcomeTitle = nativeElement.querySelector('.brand-block h1')?.textContent?.trim();
    const mobileInput = nativeElement.querySelector('ion-input[formcontrolname="mobile"]');

    _expect(welcomeTitle).toBe('¡Hola, bienvenido!');
    _expect(mobileInput).toBeTruthy();
  });

  it('should keep the continue button disabled for an invalid mobile', () => {
    (component as any).loginForm.get('mobile')?.setValue('511223344');
    (component as any).loginForm.get('mobile')?.markAsTouched();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const continueButton = nativeElement.querySelector('ion-button.contain-button') as any;
    const mobileError = nativeElement.querySelector('.validation-text')?.textContent?.trim();

    _expect((component as any).isMobileValid).toBeFalse();
    _expect(continueButton?.disabled).toBeTrue();
    _expect(mobileError).toBe('El móvil ingresado no es válido.');
  });

  it('should enable the continue button for a valid mobile', () => {
    (component as any).loginForm.get('mobile')?.setValue('612345678');
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const continueButton = nativeElement.querySelector('ion-button.contain-button') as any;

    _expect((component as any).isMobileValid).toBeTrue();
    _expect(continueButton?.disabled).toBeFalse();
  });

  it('should show the OTP step after goToCodeStep with a valid mobile', fakeAsync(async () => {
    (component as any).loginForm.get('mobile')?.setValue('612345678');

    const promise = (component as any).goToCodeStep();
    tick(1000);
    await promise;
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const otpInput = nativeElement.querySelector('ion-input-otp');
    const codeTitle = nativeElement.querySelector('.code-block .code-title')?.textContent?.trim();
    const codeLabel = nativeElement.querySelector('.code-label')?.textContent?.trim();
    const backButton = nativeElement.querySelector('.back ion-icon');

    _expect((component as any).showCodeStep).toBeTrue();
    _expect(otpInput).toBeTruthy();
    _expect(codeTitle).toBe('Ingresa código de verificación');
    _expect(codeLabel).toBe('Enviado vía SMS al xxxxx5678');
    _expect(backButton).toBeTruthy();
  }));

  it('should trigger submitLogin when OTP has 6 digits', async () => {
    const submitSpy = (globalThis as any).spyOn(component as any, 'submitLogin').and.resolveTo();

    await (component as any).onOtpChange({ detail: { value: '123456' } });

    _expect(submitSpy).toHaveBeenCalled();
  });

  it('should navigate to reservations when submitLogin completes', fakeAsync(() => {
    const navigateSpy = (globalThis as any).spyOn((component as any).navController, 'navigateRoot');

    (component as any).submitLogin();
    tick(850);
    tick(10);

    _expect(navigateSpy).toHaveBeenCalledWith('/reservations');
  }));
});
