import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { IonCol, IonContent, IonGrid, IonIcon, IonRow, IonCard, IonButton,IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { HeaderAppComponent } from '../../shared/components/header-app/header-app.component';

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  price: number;
  discount: number;
  installments: string;
  freeShipping: boolean;
  image: string;
}

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
  imports: [IonCol, IonContent, IonGrid, IonIcon, IonButton, IonRow, IonCard, IonCardContent, NgFor, NgIf, HeaderAppComponent],
})
export class ProductsPage {
  protected showAll = false;

  protected readonly banners = [
    { img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', alt: 'Oferta en laptops' },
    { img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80', alt: 'Descuento en accesorios' },
    { img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', alt: 'Promoción en monitores' },
  ];

  protected readonly products: Product[] = [
    { id: 1,  name: 'Deepcool Gammaxx Ag400 Plus Enfriador De CPU',        originalPrice: 100,  price: 87,   discount: 12, installments: '',  freeShipping: true,  image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80' },
    { id: 2,  name: 'Teclado Gamer Machenike Mecánico K500 Sp Red Switch', originalPrice: 256,  price: 163,  discount: 36, installments: '',  freeShipping: true,  image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80' },
    { id: 3,  name: 'Tp-link Ub500 Adaptador Bluetooth 5.0 Nano Usb',      originalPrice: 31,   price: 23,   discount: 25, installments: '',   freeShipping: false, image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80' },
    { id: 4,  name: 'Refrigeración Líquida RGB 120mm Intel/AMD',           originalPrice: 219,  price: 78,   discount: 63, installments: '',  freeShipping: true,  image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80' },
    { id: 5,  name: 'Monitor Gamer 27" AOC 165Hz IPS Full HD HDMI',        originalPrice: 899,  price: 649,  discount: 28, installments: '', freeShipping: true,  image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
    { id: 6,  name: 'Auriculares Inalámbricos Sony WH-1000XM5',            originalPrice: 499,  price: 319,  discount: 36, installments: '',  freeShipping: true,  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { id: 7,  name: 'Mouse Logitech G502 Hero Gaming 25600 DPI',           originalPrice: 159,  price: 98,   discount: 38, installments: '',  freeShipping: false, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80' },
    { id: 8,  name: 'Tablet Samsung Galaxy Tab A9 Plus 64GB WiFi',         originalPrice: 1199, price: 849,  discount: 29, installments: '', freeShipping: true,  image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80' },
    { id: 9,  name: 'SSD Portable Kingston XS2000 2TB USB 3.2 Gen 2x2',    originalPrice: 349,  price: 249,  discount: 29, installments: '',  freeShipping: false, image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=800&q=80' },
    { id: 10, name: 'Silla Gamer Ergonómica RGB con Reposapiés Lumbar',    originalPrice: 599,  price: 449,  discount: 25, installments: '',  freeShipping: true,  image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=800&q=80' },
  ];

  constructor(private navCtrl: NavController) {
    addIcons({ chevronDownOutline });
  }

  protected get visibleProducts(): Product[] {
    return this.showAll ? this.products : this.products.slice(0, 4);
  }

  protected toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  protected onLogout(): void {
    // Limpiar reservas del localStorage
    localStorage.removeItem('reservations-data');
    // Navegación estándar de Angular
    this.navCtrl.navigateRoot('/login');
  }
}
