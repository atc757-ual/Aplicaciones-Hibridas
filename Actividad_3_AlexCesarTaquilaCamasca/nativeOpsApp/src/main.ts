import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

//importamos la función defineCustomElements del paquete 
//@ionic/pwa-elements/loader para cargar los componentes personalizados de Ionic en la aplicación
import { defineCustomElements } from '@ionic/pwa-elements/loader';

//inicializamos la aplicación Angular utilizando bootstrapApplication, proporcionando el componente 
//raíz AppComponent y configurando los proveedores necesarios para Ionic y el enrutamiento
defineCustomElements(window); 

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
