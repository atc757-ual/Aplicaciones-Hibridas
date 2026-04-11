import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Tabs } from './tabs';

const _expect = (globalThis as any).expect as any;

describe('Tabs', () => {
  let component: Tabs;
  let fixture: ComponentFixture<Tabs>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [Tabs],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  const tabs = [
    { tab: 'clients', label: 'Clients', icon: 'people' },
    { tab: 'reservations', label: 'Reservations', icon: 'calendar' },
    { tab: 'products', label: 'Products', icon: 'bag' },
  ];

  tabs.forEach((item) => {
    it(`should show correct label and icon for ${item.tab} tab`, () => {
      const nativeElement = fixture.nativeElement as HTMLElement;
      const tab = nativeElement.querySelector(`ion-tab-button[tab="${item.tab}"]`);
      const label = tab?.querySelector('ion-label')?.textContent?.trim();
      const icon = tab?.querySelector('ion-icon');

      _expect(tab).toBeTruthy();
      _expect(label).toBe(item.label);
      _expect(icon?.getAttribute('name')).toBe(item.icon);
    });
  });
});
