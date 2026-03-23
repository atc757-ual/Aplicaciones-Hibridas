import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonImg, IonInput, IonItem,IonSelect,
  IonSelectOption, IonButton, IonToolbar,IonBackButton,IonCheckbox,IonAccordion,IonAccordionGroup,
  IonIcon,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonLabel,
  IonTextarea } from '@ionic/angular/standalone';
import { Camera, CameraResultType } from '@capacitor/camera'; //importamos el plugin de cámara de Capacitor
import { DomSanitizer } from '@angular/platform-browser'; //importamos el servicio DomSanitizer para manejar URLs seguras en Angular
import { MapaService } from 'src/core/utils/maps.utils'; //importamos el servicio MapaService para manejar la creación y manipulación de mapas en la aplicación
import { Geolocation } from '@capacitor/geolocation'; //imortamos el plugin de geolocalización de Capacitor
import { StorageService } from 'src/core/services/storage.service';
import { SimpleReport,Categories } from 'src/core/models/models';

//importamos el modelo de incidente para definir la estructura de los datos del incidente
@Component({
  selector: 'app-incidentecreate',
  templateUrl: './incidentecreate.page.html',
  styleUrls: ['./incidentecreate.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonImg, IonInput, IonItem, IonSelect, 
     IonSelectOption, IonButton, IonToolbar, IonIcon,   IonCheckbox, IonAccordion, IonAccordionGroup,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonLabel, 
    IonTextarea, CommonModule, FormsModule, IonBackButton]
})
export class IncidentecreatePage  {
  // =============================
  // PROPIEDADES DE UI Y ESTADO
  // =============================
  public isDesktop: boolean = false; // Estado: ¿pantalla de escritorio?
  public expandedAccordions: string[] = []; // Accordions abiertos
  // Se elimina photo, se usan solo photos en el modelo
  public reporte: SimpleReport = {
    id: '',
    title: '',
    description: '',
    category: '',
    photos: [],
    latitude: 0,
    longitude: 0,
    aceptoTerminos: false,
    accuracy: 0,
    status: 'pendiente',
    priority: 'media',
    createdAt: '',
    updatedAt: ''
  };
  categories = Categories;
  private sanitizer = inject(DomSanitizer); // Para sanear URLs

  // =============================
  // CICLO DE VIDA
  // =============================
  constructor(private mapaService: MapaService) {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.mapaService.destruirMapa();
  }

  // =============================
  // LÓGICA DE UI
  // =============================
  checkScreenSize() {
    this.isDesktop = window.innerWidth > 768;
    if (this.isDesktop) {
      this.expandedAccordions = ['fotos', 'ubicacion'];
    } else {
      this.expandedAccordions = [];
    }
  }

  // =============================
  // LÓGICA DE NEGOCIO
  // =============================
  public async takePicture(): Promise<void> {
    if (this.reporte.photos.length >= 5) {
      // Opcional: mostrar alerta o feedback
      return;
    }
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      if (image.webPath) {
        this.reporte.photos.push(image.webPath);
      }
    } catch (error) {
      console.error('Error al capturar la foto:', error);
    }
  }

  public eliminarFoto(index: number): void {
    this.reporte.photos.splice(index, 1);
  }

  public async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.reporte.latitude = position.coords.latitude;
      this.reporte.longitude = position.coords.longitude;
      this.reporte.accuracy = position.coords.accuracy;
      this.mapaService.crearMapa('mapa-container', this.reporte.latitude, this.reporte.longitude, this.reporte.accuracy > 0 ? 15 : 13); 
      setTimeout(() => {
        this.mapaService.getMapa()?.invalidateSize();
      }, 200);
      this.mapaService.agregarMarcador(this.reporte.latitude, this.reporte.longitude);
    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
    }
  }

  submitReport() {
    // Lógica para enviar el reporte
  }

  
  // =============================
  // UTILIDADES
  // =============================
  public getSanitizedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${inputLength + '/' + maxLength}`;
  }
}
