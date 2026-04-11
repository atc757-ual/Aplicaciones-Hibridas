import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderApp } from './header-app';

describe('HeaderApp', () => {
  let component: HeaderApp;
  let fixture: ComponentFixture<HeaderApp>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderApp],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create header', () => {
    expect(component).toBeTruthy();
  });

 const titles = ['Clientes', 'Products', 'Reservations'];

  titles.forEach((expectedTitle) => {
    it(`should render page title as "${expectedTitle}"`, () => {
      component.title = expectedTitle;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement as HTMLElement;
      const title = nativeElement.querySelector('ion-title.header-title')?.textContent?.trim();

      expect(title).toBe(expectedTitle);
    });
  });

  it('should render back button when hideBack is false', () => {
    component.hideBack = false;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const backButton = nativeElement.querySelector('ion-back-button');
    expect(backButton).toBeTruthy();
  });

  it('should not render back button when hideBack is true', () => {
    component.hideBack = true;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const backButton = nativeElement.querySelector('ion-back-button');
    expect(backButton).toBeFalsy();
  });
});
