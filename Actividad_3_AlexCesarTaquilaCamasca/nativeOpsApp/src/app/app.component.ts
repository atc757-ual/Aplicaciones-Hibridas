import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { camera, location, checkmarkCircleOutline, informationCircleOutline,add, 
   mapOutline,addCircleOutline,listCircleOutline,chevronForwardOutline,send,closeCircle 
 
} from 'ionicons/icons'; //importamos el icono de cámara de Ionicons para usarlo en la interfaz de usuario
import { addIcons } from 'ionicons'; //importamos el icono de agregar de Ionicons para usarlo en la interfaz de usuario
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {addIcons({checkmarkCircleOutline,camera,informationCircleOutline,location,add,
    mapOutline,addCircleOutline,listCircleOutline,chevronForwardOutline,send,closeCircle
  }); }
}
