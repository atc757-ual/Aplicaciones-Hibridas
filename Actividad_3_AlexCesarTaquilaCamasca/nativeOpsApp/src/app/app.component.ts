import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from 'src/core/storages/storage';
import { ModelReport } from 'src/core/models/model-photo';
import {
  camera,
  location,
  checkmarkCircleOutline,
  informationCircleOutline,
  add,
  mapOutline,
  addCircleOutline,
  listCircleOutline,
  chevronForwardOutline,
  chevronBackOutline,
  send,
  closeCircle,
  closeCircleOutline,
  closeOutline,
  warningOutline,
} from 'ionicons/icons'; //importamos el icono de cámara de Ionicons para usarlo en la interfaz de usuario
import { addIcons } from 'ionicons'; //importamos el icono de agregar de Ionicons para usarlo en la interfaz de usuario
import { REPORTES_SEED } from 'src/core/services/report.seed';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private storageService: StorageService) {
    addIcons({
      checkmarkCircleOutline,
      camera,
      informationCircleOutline,
      location,
      add,
      mapOutline,
      addCircleOutline,
      listCircleOutline,
      closeCircleOutline,
      chevronForwardOutline,
      chevronBackOutline,
      send,
      closeCircle,
      closeOutline,
      warningOutline
    });
    this.precargarReportes();
  }

  async precargarReportes() {
    const existentes = await this.storageService.getItems('Reporte');
    if (!Array.isArray(existentes) || existentes.length === 0) {
      await this.storageService.setItem('Reporte', REPORTES_SEED);
    }
  }

  async ngOnInit() {
    await this.precargarReportes();
  }
}
