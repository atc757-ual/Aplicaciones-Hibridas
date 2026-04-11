import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ClientsPage } from './clients.page';
import { ClientsService } from '../../core/services/clients.service';

const _expect = (globalThis as any).expect as any;

describe('ClientsPage', () => {
  let component: ClientsPage;
  let fixture: ComponentFixture<ClientsPage>;
  let clientsService: ClientsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClientsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsPage);
    component = fixture.componentInstance;
    clientsService = TestBed.inject(ClientsService);
    fixture.detectChanges();
  }));

  it('should create ClientsPage component', () => {
    _expect(component).toBeTruthy();
  });

  it('should render a header with title "Clientes"', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const headerTitle = nativeElement.querySelector('ion-title.header-title')?.textContent?.trim();
    _expect(headerTitle).toBe('Clientes');
  });

  it('should render the searchbar for filtering employees', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const searchbar = nativeElement.querySelector('ion-searchbar.clients-searchbar');

    _expect(searchbar).toBeTruthy();
  });

  it('should render a result count that includes total clients', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const count = nativeElement.querySelector('.results-count')?.textContent?.trim();
    _expect(count).toContain(clientsService.clients.length.toString());
  });
  
  it('should render one list item per client from service', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const renderedItems = nativeElement.querySelectorAll('ion-item.client-item');

    _expect(renderedItems.length).toBe(clientsService.clients.length);
  });

  it('should render each client name and role-department from service data', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const renderedItems = Array.from(nativeElement.querySelectorAll('ion-item.client-item'));

    clientsService.clients.forEach((client, index) => {
      const item = renderedItems[index];
      const name = item.querySelector('ion-label h2')?.textContent?.trim();
      const roleDepartment = item.querySelector('ion-label p')?.textContent?.trim();

      _expect(name).toBe(client.name);
      _expect(roleDepartment).toBe(`${client.role} · ${client.department}`);
    });
  });

  it('should render each client image with expected src and alt', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const renderedItems = Array.from(nativeElement.querySelectorAll('ion-item.client-item'));

    clientsService.clients.forEach((client, index) => {
      const item = renderedItems[index];
      const image = item.querySelector('ion-avatar img') as HTMLImageElement | null;

      _expect(image).toBeTruthy();
      _expect(image?.getAttribute('src')).toBe(client.img);
      _expect(image?.getAttribute('alt')).toBe(client.name);
    });
  });

  it('should render status dot active class according to client status', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const renderedItems = Array.from(nativeElement.querySelectorAll('ion-item.client-item'));

    clientsService.clients.forEach((client, index) => {
      const item = renderedItems[index];
      const statusDot = item.querySelector('.status-dot');

      _expect(statusDot).toBeTruthy();
      _expect(statusDot?.classList.contains('active')).toBe(client.status === 'activo');
    });
  });

  it('should filter employees when searching by name or role', () => {
    const targetClient = clientsService.clients[0];

    (component as any).onSearch({ detail: { value: targetClient.name.slice(0, 3) } } as CustomEvent);
    fixture.detectChanges();

    _expect((component as any).filteredClients.length).toBeGreaterThan(0);
    _expect((component as any).filteredClients.some((client: any) => client.name === targetClient.name)).toBeTrue();

    (component as any).onSearch({ detail: { value: targetClient.role } } as CustomEvent);
    fixture.detectChanges();

    _expect((component as any).filteredClients.length).toBeGreaterThan(0);
    _expect((component as any).filteredClients.every((client: any) => client.role === targetClient.role)).toBeTrue();
  });
});
