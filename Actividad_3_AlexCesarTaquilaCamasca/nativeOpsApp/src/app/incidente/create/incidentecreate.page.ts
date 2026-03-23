import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonImg, IonInput, IonItem,IonSelect,
  IonSelectOption, IonButton, IonToolbar,IonBackButton,
  IonIcon,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonLabel,
  IonTextarea } from '@ionic/angular/standalone';
import { Camera, CameraResultType } from '@capacitor/camera'; //importamos el plugin de cámara de Capacitor
import { DomSanitizer } from '@angular/platform-browser'; //importamos el servicio DomSanitizer para manejar URLs seguras en Angular
import { MapaService } from 'src/core/utils/maps.utils'; //importamos el servicio MapaService para manejar la creación y manipulación de mapas en la aplicación
import { Geolocation } from '@capacitor/geolocation'; //imortamos el plugin de geolocalización de Capacitor
import { StorageService } from 'src/core/services/storage.service';
import { SimpleReport } from 'src/core/models/models';
//importamos el modelo de incidente para definir la estructura de los datos del incidente
@Component({
  selector: 'app-incidentecreate',
  templateUrl: './incidentecreate.page.html',
  styleUrls: ['./incidentecreate.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonImg, IonInput, IonItem, IonSelect, 
     IonSelectOption, IonButton, IonToolbar, IonIcon,   
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonLabel, 
    IonTextarea, CommonModule, FormsModule, IonBackButton]
})
export class IncidentecreatePage  {


  constructor(private mapaService: MapaService) {}

  // Método para sanear URLs de imágenes antes de mostrarlas
  public getSanitizedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public photo: string | undefined; //propiedad para almacenar la URL de la foto tomada con la cámara, como string
  private sanitizer = inject(DomSanitizer); //inyección del servicio DomSanitizer para manejar URLs seguras en Angular

  //declaración del método takePicture que utiliza el plugin de cámara para tomar una foto y almacenar su URL en la propiedad photo
  public async takePicture(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      if (image.webPath) {
        console.log('image.webPath:', image.webPath);
        this.photo = image.webPath;
      }
    } catch (error) {
      console.error('Error al capturar la foto:', error);
    }
  }

  public eliminarFoto(index: number): void {
    this.reporte.photos.splice(index, 1);
  }
  // Inicializa el modelo para el formulario con los mismos campos que tu interface SimpleReport
  public reporte: SimpleReport = {
    id: '',
    title: '',
    description: '',
    category: '',
    photos: [],
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    status: 'pending',
    priority: 'medium',
    createdAt: '',
    updatedAt: ''
  };

  ngOnInit() {
  }

  ngOnDestroy() {
    this.mapaService.destruirMapa();
  }

  //declaración del método getLocation que utiliza el plugin de geolocalización para obtener la ubicación actual del usuario
  public async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition(); //obtenemos la posición actual del usuario
      this.reporte.latitude = position.coords.latitude;
      this.reporte.longitude = position.coords.longitude;
      this.reporte.accuracy = position.coords.accuracy;
      this.mapaService.crearMapa('mapa-container', this.reporte.latitude, this.reporte.longitude, this.reporte.accuracy > 0 ? 15 : 13); //creamos el mapa centrado en la ubicación del usuario, ajustando el zoom según la precisión de la ubicación
          // Solución para el tamaño del mapa
          setTimeout(() => {
            this.mapaService.getMapa()?.invalidateSize();
          }, 200);
          // Agregar un marcador
          this.mapaService.agregarMarcador(this.reporte.latitude, this.reporte.longitude);
          // Agregar más marcadores de ejemplo
    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
    }
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${inputLength +'/'+maxLength}`;
  }
  
}
