import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CreateReservationPage } from './create-reservation.page';

const _expect = (globalThis as any).expect as any;


describe('CreateReservationPage', () => {
  let component: CreateReservationPage;
  let fixture: ComponentFixture<CreateReservationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreateReservationPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    _expect(component).toBeTruthy();
  });

  it('should render the create reservation header title', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const title = nativeElement.querySelector('ion-title.header-title')?.textContent?.trim();

    _expect(title).toBe('Crear reservacion');
  });

  it('should keep destination disabled until origin is selected', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const destinationTrigger = nativeElement.querySelectorAll('.custom-select__trigger')[1] as HTMLButtonElement;

    _expect(destinationTrigger?.disabled).toBeTrue();
  });

  it('should render the preview card and save button after completing the three fields', () => {
    const firstFlight = (component as any).flightOptions[0];

    (component as any).form.controls['origen'].setValue(firstFlight.origen);
    (component as any).form.controls['destino'].setValue(firstFlight.destino);
    (component as any).form.controls['fechaViaje'].setValue(firstFlight.fechaViaje);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const previewCard = nativeElement.querySelector('.flight-preview');
    const routeCodes = nativeElement.querySelectorAll('.flight-preview .route-code');
    const timeLabels = nativeElement.querySelectorAll('.flight-preview .time-main');
    const cityLabels = nativeElement.querySelectorAll('.flight-preview .city-name');
    const footerLabels = nativeElement.querySelectorAll('.flight-preview .flight-meta');
    const saveButton = nativeElement.querySelector('ion-button.submit-button');

    _expect(previewCard).toBeTruthy();
    _expect(routeCodes[0]?.textContent?.trim()).toBe(firstFlight.codIataOrigen);
    _expect(routeCodes[1]?.textContent?.trim()).toBe(firstFlight.codIataDestino);
    _expect(timeLabels[0]?.textContent?.trim()).toBe(firstFlight.horaSalida);
    _expect(timeLabels[1]?.textContent?.trim()).toBe(firstFlight.horaLlegada);
    _expect(cityLabels[0]?.textContent?.trim()).toBe(firstFlight.origen);
    _expect(cityLabels[1]?.textContent?.trim()).toBe(firstFlight.destino);
    _expect(footerLabels[0]?.textContent?.trim()).toBe(firstFlight.aerolinea);
    _expect(footerLabels[1]?.textContent?.trim()).toBe('11/04/2026');
    _expect(saveButton).toBeTruthy();
  });
});
