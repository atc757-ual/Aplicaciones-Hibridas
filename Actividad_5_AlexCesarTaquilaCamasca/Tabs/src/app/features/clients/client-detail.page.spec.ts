import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientDetailPage } from './client-detail.page';

const _expect = (globalThis as any).expect as any;

describe('ClientDetailPage', () => {
  let component: ClientDetailPage;
  let fixture: ComponentFixture<ClientDetailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClientDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDetailPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    _expect(component).toBeTruthy();
  });

  it('should render the detail header with title', () => {
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const headerTitle = nativeElement.querySelector('ion-title.header-title')?.textContent?.trim();

    _expect(headerTitle).toBe('Detalle de cliente');
  });

  it('should load the client when the id input is valid', () => {
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    _expect(component['client']).toBeTruthy();
    _expect(component['client']?.id).toBe(1);
  });

  it('should render name, role and status for the selected client', () => {
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const clientName = nativeElement.querySelector('.client-name')?.textContent?.trim();
    const clientRole = nativeElement.querySelector('.client-role')?.textContent?.trim();
    const statusBadge = nativeElement.querySelector('.status-badge')?.textContent?.trim();
    const clientImage = nativeElement.querySelector('.profile-header img') as HTMLImageElement | null;

    _expect(clientName).toBeTruthy();
    _expect(clientRole).toBeTruthy();
    _expect(statusBadge).toMatch(/^(Activo|Inactivo)$/);
    _expect(clientImage).toBeTruthy();
    _expect(clientImage?.getAttribute('src')).toBe(component['client']?.img);
    _expect(clientImage?.getAttribute('alt')).toBe(component['client']?.name);
  });

  it('should render the detail icons and information labels', () => {
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const infoItems = nativeElement.querySelectorAll('.info-list ion-item');

    _expect(infoItems.length).toBe(5);

    const firstItemIcon = infoItems[0].querySelector('ion-icon')?.getAttribute('name');
    const secondItemIcon = infoItems[1].querySelector('ion-icon')?.getAttribute('name');
    const thirdItemIcon = infoItems[2].querySelector('ion-icon')?.getAttribute('name');
    const fourthItemIcon = infoItems[3].querySelector('ion-icon')?.getAttribute('name');
    const fifthItemIcon = infoItems[4].querySelector('ion-icon')?.getAttribute('name');

    _expect(firstItemIcon).toBe('mail-outline');
    _expect(secondItemIcon).toBe('call-outline');
    _expect(thirdItemIcon).toBe('business-outline');
    _expect(fourthItemIcon).toBe('location-outline');
    _expect(fifthItemIcon).toBe('calendar-outline');

    const labels = Array.from(infoItems).map((item) => item.querySelector('ion-label p')?.textContent?.trim());

    _expect(labels).toEqual([
      'Email',
      'Móvil',
      'Deparamento',
      'Ubicación',
      'Fecha de incorporación',
    ]);
  });

  it('should render client detail values for email, phone, department, location and join date', () => {
    component.id = '1';
    component.ngOnInit();
    fixture.detectChanges();

    const client = component['client'];
    const nativeElement = fixture.nativeElement as HTMLElement;
    const values = Array.from(nativeElement.querySelectorAll('.info-list ion-item ion-label h3')).map((item) =>
      item.textContent?.trim() ?? '',
    );

    _expect(client).toBeTruthy();
    const selectedClient = client!;

    _expect(values).toEqual([
      selectedClient.email,
      selectedClient.phone,
      selectedClient.department,
      selectedClient.location,
      selectedClient.joinDate,
    ]);
  });

  it('should render not-found state when id input is invalid', () => {
    component.id = '9999';
    component.ngOnInit();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const notFoundText = nativeElement.querySelector('.not-found p')?.textContent?.trim();

    _expect(notFoundText).toBe('Cliente no encontrado');
  });
});
