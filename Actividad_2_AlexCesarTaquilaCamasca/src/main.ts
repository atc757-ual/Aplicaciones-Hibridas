import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

import { addIcons } from 'ionicons';
import { star, starOutline, starHalf, fastFoodOutline,arrowForwardOutline, cafeOutline, wineOutline, iceCreamOutline, pizzaOutline, arrowBackOutline, heart, heartOutline } from 'ionicons/icons';


// Registrar los íconos necesarios de Ionicons
addIcons({
  star,
  'star-outline': starOutline,
  'star-half': starHalf,
  'fast-food-outline': fastFoodOutline,
  'cafe-outline': cafeOutline,
  'wine-outline': wineOutline,
  'ice-cream-outline': iceCreamOutline,
  'pizza-outline': pizzaOutline,
  'arrow-back-outline': arrowBackOutline,
  'arrow-forward-outline': arrowForwardOutline,
  'heart-outline': heartOutline,
  'heart': heart
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ],
});
