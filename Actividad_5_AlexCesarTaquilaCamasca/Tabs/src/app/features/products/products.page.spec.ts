import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ProductsPage } from './products.page';

const _expect = (globalThis as any).expect as any;


describe('ProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [
        {
          provide: NavController,
          useValue: { navigateRoot: () => undefined },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    _expect(component).toBeTruthy();
  });

  it('should render the products header title', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const title = nativeElement.querySelector('ion-title.header-title')?.textContent?.trim();

    _expect(title).toBe('Productos');
  });

  it('should render the products banner content', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const bannerTitle = nativeElement.querySelector('.banner-title')?.textContent?.trim();
    const bannerDetail = nativeElement.querySelector('.banner-detail')?.textContent?.trim();

    _expect(bannerTitle).toBe('Lo mejor de la tecnología');
    _expect(bannerDetail).toBe('Descubre productos exclusivos y ofertas especiales para ti.');
  });

  it('should render 4 products by default', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const cards = nativeElement.querySelectorAll('.product-card');

    _expect(cards.length).toBe(4);
  });

  it('should render the full structure of the first product card', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const firstProduct = (component as any).visibleProducts[0];
    const firstCard = nativeElement.querySelector('.product-card') as HTMLElement | null;

    _expect(firstCard).toBeTruthy();
    _expect(firstCard?.querySelector('.product-name')?.textContent?.trim()).toBe(firstProduct.name);
    _expect(firstCard?.querySelector('.original-price')?.textContent?.trim()).toContain(`€ ${firstProduct.originalPrice}`);
    _expect(firstCard?.querySelector('.current-price')?.textContent?.trim()).toContain(`€ ${firstProduct.price}`);
    _expect(firstCard?.querySelector('.discount-badge')?.textContent?.trim()).toBe(`${firstProduct.discount}% OFF`);

    const image = firstCard?.querySelector('img') as HTMLImageElement | null;
    _expect(image).toBeTruthy();
    _expect(image?.getAttribute('src')).toBe(firstProduct.image);
    _expect(image?.getAttribute('alt')).toBe(firstProduct.name);
  });

  it('should render the free shipping badge only for products that have it', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const visibleProducts = (component as any).visibleProducts;
    const freeShippingCards = Array.from(nativeElement.querySelectorAll('.product-card')).filter((card, index) =>
      visibleProducts[index].freeShipping,
    );
    const shippingBadges = nativeElement.querySelectorAll('.free-shipping');

    _expect(freeShippingCards.length).toBe(shippingBadges.length);
    _expect(shippingBadges.length).toBeGreaterThan(0);
  });

  it('should render more products after toggling showAll', () => {
    (component as any).toggleShowAll();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const cards = nativeElement.querySelectorAll('.product-card');

    _expect(cards.length).toBeGreaterThan(4);
  });

  it('should change the toggle label after showing all products', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const toggleButton = nativeElement.querySelector('.contain-button ion-button span')?.textContent?.trim();

    _expect(toggleButton).toBe('Ver más productos');

    (component as any).toggleShowAll();
    fixture.detectChanges();

    const updatedLabel = nativeElement.querySelector('.contain-button ion-button span')?.textContent?.trim();

    _expect(updatedLabel).toBe('Ver menos productos');
  });

  it('should render the logout button', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const logoutButton = Array.from(nativeElement.querySelectorAll('ion-button')).find((button) =>
      button.textContent?.includes('Cerrar Sesión'),
    );

    _expect(logoutButton).toBeTruthy();
  });
});
