import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';

import { ReservationsPage } from './reservations.page';
import { ReservationsService } from '../../core/services/reservations.service';

const _expect = (globalThis as any).expect as any;


describe('ReservationsPage', () => {
  let component: ReservationsPage;
  let fixture: ComponentFixture<ReservationsPage>;
  let reservationsService: ReservationsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReservationsPage],
      providers: [
        {
          provide: NavController,
          useValue: { navigateForward: () => undefined },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsPage);
    component = fixture.componentInstance;
    reservationsService = TestBed.inject(ReservationsService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    _expect(component).toBeTruthy();
  });

  it('should render the reservations header with title', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const headerTitle = nativeElement.querySelector('ion-title.header-title')?.textContent?.trim();

    _expect(headerTitle).toBe('Mis reservaciones');
  });

  it('should render pending reservations count text', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const text = nativeElement.querySelector('.results-count')?.textContent?.replace(/\s+/g, ' ').trim();

    _expect(text).toMatch(/^\d+ Reservas pendientes$/);
  });

  it('should render at least one reservation card', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const cards = nativeElement.querySelectorAll('.premium-card');

    _expect(cards.length).toBeGreaterThan(0);
  });

  it('should render all main fields inside the first reservation card', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const upcomingReservations = (component as any).getUpcomingReservations(reservationsService['reservationsSubject'].value);
    const firstReservation = upcomingReservations[0];
    const firstCard = nativeElement.querySelector('.premium-card') as HTMLElement | null;

    _expect(firstCard).toBeTruthy();
    _expect(firstCard?.querySelector('.route-code')?.textContent?.trim()).toBe(firstReservation.CodIataOrigen);
    _expect(firstCard?.querySelector('.plane-icon')).toBeTruthy();
    _expect(firstCard?.querySelectorAll('.route-code')[1]?.textContent?.trim()).toBe(firstReservation.CodIataDestino);
    _expect(firstCard?.querySelector('.time-main')?.textContent?.trim()).toBe(firstReservation.horaSalida);
    _expect(firstCard?.querySelectorAll('.time-main')[1]?.textContent?.trim()).toBe(firstReservation.horaLlegada);
    _expect(firstCard?.querySelector('.city-name')?.textContent?.trim()).toBe(firstReservation.origen);
    _expect(firstCard?.querySelectorAll('.city-name')[1]?.textContent?.trim()).toBe(firstReservation.destino);
    _expect(firstCard?.querySelector('.info-label')?.textContent?.trim()).toBe('Vuelo');
    _expect(firstCard?.querySelectorAll('.info-label')[1]?.textContent?.trim()).toBe('Aerolínea');
    _expect(firstCard?.querySelector('.footer-icon')).toBeTruthy();
    _expect(firstCard?.querySelector('.reservation-code')?.textContent?.trim()).toBe(firstReservation.numeroReserva);
    _expect(firstCard?.querySelector('.flight-date')).toBeTruthy();
    _expect(firstCard?.querySelector('.status-badge')).toBeTruthy();
  });

  it('should render the floating action button to create reservations', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const fabButton = nativeElement.querySelector('.reservations-fab ion-fab-button');

    _expect(fabButton).toBeTruthy();
  });

  it('should show past reservations toggle only when past reservations exist', () => {
    const upcomingReservations = (component as any).getUpcomingReservations(reservationsService['reservationsSubject'].value);
    const pastReservations = (component as any).getPastReservations(reservationsService['reservationsSubject'].value);
    const nativeElement = fixture.nativeElement as HTMLElement;
    const toggleButton = nativeElement.querySelector('.past-toggle-button');

    _expect(pastReservations.length).toBeGreaterThan(0);
    _expect(upcomingReservations.length).toBeGreaterThan(0);
    _expect(toggleButton).toBeTruthy();
  });

  it('should show past reservation cards after toggling visibility', () => {
    (component as any).togglePastReservations();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const pastToggle = nativeElement.querySelector('.past-toggle-button span')?.textContent?.trim();
    const pastCards = nativeElement.querySelectorAll('.premium-card--past');

    _expect(pastToggle).toBe('Ocultar reservas pasadas');
    _expect(pastCards.length).toBeGreaterThan(0);
  });

  it('should render an empty state when there are no reservations', () => {
    const emptyReservationsService = {
      reservations$: new BehaviorSubject([]).asObservable(),
    } as Partial<ReservationsService>;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ReservationsPage],
      providers: [
        {
          provide: NavController,
          useValue: { navigateForward: () => undefined },
        },
        {
          provide: ReservationsService,
          useValue: emptyReservationsService,
        },
      ],
    }).compileComponents();

    const emptyFixture = TestBed.createComponent(ReservationsPage);
    emptyFixture.detectChanges();

    const nativeElement = emptyFixture.nativeElement as HTMLElement;
    const emptyStateText = nativeElement.querySelector('.empty-state p')?.textContent?.trim();

    _expect(emptyStateText).toBe('No hay reservaciones todavía');
  });
});
