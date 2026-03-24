import { Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonImg, IonInput, IonItem,IonSelect,IonList,
  IonSelectOption, IonButton, IonToolbar,IonBackButton,IonCheckbox,IonAccordion,IonAccordionGroup,
  IonIcon,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonLabel,IonSpinner,IonModal,
  IonTextarea,ToastController  } from '@ionic/angular/standalone';
import { Camera, CameraResultType } from '@capacitor/camera'; //importamos el plugin de cámara de Capacitor
import { DomSanitizer ,SafeResourceUrl} from '@angular/platform-browser'; //importamos el servicio DomSanitizer para manejar URLs seguras en Angular
import { MapaService } from 'src/core/utils/maps.utils'; //importamos el servicio MapaService para manejar la creación y manipulación de mapas en la aplicación
import { Geolocation } from '@capacitor/geolocation'; //imortamos el plugin de geolocalización de Capacitor
import { ModelReport,Categories, Priority} from 'src/core/models/models';
import { ReporteService } from 'src/core/services/reporte-service';
import { ToastUtils } from 'src/core/utils/toast.utils';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-incidentecreate',
  templateUrl: './incidentecreate.page.html',
  styleUrls: ['./incidentecreate.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonImg,
    IonInput,
    IonSpinner,
    IonModal,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonList,
    IonToolbar,
    IonIcon,
    IonCheckbox,
    IonAccordion,
    IonAccordionGroup,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonLabel,
    IonTextarea,
    CommonModule,
    FormsModule,
    IonBackButton,
  ],
})
export class IncidentecreatePage {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @ViewChild('modalMapa', { static: false }) modalMapa  !: IonModal;
  public isDesktop: boolean = false;
  public expandedAccordions: string[] = [];
  public reporte: ModelReport = {
    id: '',
    title: '',
    description: '',
    category: '',
    photos: [],
    aceptoTerminos: false,
    status: '',
    priority: 'baja',
    createdAt: '',
  };
  public categories = Categories;
  public isLoadingSubmit = false;
  public isLoadingGeo = false;
  public hasPermisionGeo = false;
  public isLoadingTakePicture = false;
  public fotoMapaIndex: number | null = null;

    constructor(
    private mapaService: MapaService,
    private reporteService: ReporteService,
    private toastController: ToastController, 
    private sanitizer: DomSanitizer,
    private navCtrl: NavController,
  ) {
    this.sanitizer = sanitizer;
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  async ngOnInit() {
    this.hasPermisionGeo = await this.reporteService.isGeolocationPermissionGranted();
  }

  async compartirUbicacion() {
    this.isLoadingGeo = true;
    this.hasPermisionGeo = await this.reporteService.requestGeolocationPermission();
    if (!this.hasPermisionGeo) {
      ToastUtils.show('Permiso denegado.', { duration: 'long', position: 'top' });
    } else {
      ToastUtils.show('Permiso a ubicación otorgado', { duration: 'long', position: 'top' });
    }
    this.isLoadingGeo = false;
  }

  ngOnDestroy() {
    this.mapaService.destruirMapa();
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth > 768;
    if (this.isDesktop) {
      this.expandedAccordions = ['fotos', 'ubicacion','otros'];
    } else {
      this.expandedAccordions = [];
    }
  }
  // Solo para mostrar la última foto tomada en la vista
  public photoPreview?: SafeResourceUrl;
  public async takePicture(): Promise<void> {
    
    if (this.reporte.photos.length >= 5) {
      return;
    }
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.isLoadingTakePicture = true;
      if (image.webPath) {
        // Obtener ubicación al tomar la foto
        let latitude = 0;
        let longitude = 0;
        let accuracy = 0;
        try {
          const position = await Geolocation.getCurrentPosition();
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          accuracy = position.coords.accuracy;
        } catch (geoErr) {
          console.warn('No se pudo obtener ubicación para la foto:', geoErr);
        }
        // Guardar la foto con ubicación
        this.reporte.photos.push({
          url: image.webPath,
          latitude,
          longitude,
          accuracy
        });
        // Solo para previsualización en la vista
        this.photoPreview = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
      }
    } catch (error) {
      console.error('Error al capturar la foto:', error);
    } finally {
      this.isLoadingTakePicture = false;
    }
  }

  public eliminarFoto(index: number): void {
    this.reporte.photos.splice(index, 1);
  }



  public async getLocation() {
    this.isLoadingGeo = true;
    try {
      const position = await Geolocation.getCurrentPosition();
      // Si tienes al menos una foto, actualiza la ubicación de la última foto
      if (this.reporte.photos.length > 0) {
        const lastPhoto = this.reporte.photos[this.reporte.photos.length - 1];
        lastPhoto.latitude = position.coords.latitude;
        lastPhoto.longitude = position.coords.longitude;
        lastPhoto.accuracy = position.coords.accuracy;
      }
      // Si quieres mostrar el mapa, usa la ubicación de la última foto
      if (this.reporte.photos.length > 0) {
        const lastPhoto = this.reporte.photos[this.reporte.photos.length - 1];
        this.mapaService.crearMapa(
          'mapa-container',
          lastPhoto.latitude,
          lastPhoto.longitude,
          lastPhoto.accuracy > 0 ? 15 : 13,
        );
        setTimeout(() => {
          this.mapaService.getMapa()?.invalidateSize();
        }, 10);
        this.mapaService.agregarMarcador(
          lastPhoto.latitude,
          lastPhoto.longitude,
        );
      }
    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
    } finally {
      this.isLoadingGeo = false;
    }
  }


  async presentToast(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
      message: 'Registro exitoso, tu código de incidencia es: ' + this.reporte.id ,
      duration: 3000,
      position: position,
      icon: 'checkmark-circle-outline',
      cssClass: 'toast-success'
  });

    await toast.present();
  }

  async submitReport() {
    this.isLoadingSubmit = true;
    this.reporte.createdAt = new Date().toISOString();
    this.reporte.id = 'RI-' + Date.now(); 
    this.reporte.status = 'pendiente';
    // Si la prioridad no está definida, asignar según la categoría
    if (!this.reporte.priority && this.reporte.category) {
      const categoria = Categories.find(cat => cat.value === this.reporte.category);
      this.reporte.priority = categoria ? categoria.priority as Priority : 'baja';
    }
    console.log(this.reporte);

    await this.reporteService.add(this.reporte);

    setTimeout(() => {
       this.isLoadingSubmit = false;
       this.modal.present();
    }, 1000);

  //await this.presentToast('top');
   //await ToastUtils.show('Tu Reporte se ha generado correctamente, tu código es: ' + this.reporte.id, { duration: 'long', position: 'top' });
  }
async abrirModalMapa(index: number) {
  this.fotoMapaIndex = index;
  await this.modalMapa.present();
}
onModalMapaPresent() {
  if (this.fotoMapaIndex !== null) {
    const foto = this.reporte.photos[this.fotoMapaIndex];
    if (foto) {
      console.log(foto);
      this.mapaService.crearMapa(
        'mapa-container',
        foto.latitude,
        foto.longitude,
        foto.accuracy > 0 ? 15 : 13,
      );
      this.mapaService.agregarMarcador(
        foto.latitude,
        foto.longitude,
      );
    }
  }
}
  async verDetalle() {
  if (this.modal) {
    await this.modal.dismiss();
  }
    this.navCtrl.navigateForward(['/incidente-detail'], { queryParams: { id: this.reporte.id } });
  }

  async Close(){
    if (this.modal) {
      await this.modal.dismiss();
    }
  
      this.reporte.id= '';
      this.reporte.title='',
      this.reporte.description='';
      this.reporte.category='';
      this.reporte.photos= [];
      this.reporte.aceptoTerminos= false;
      this.reporte.status= '';
      this.reporte.priority= 'baja';      
      this.reporte.createdAt= '';

  }
  onCategoriaChange(categoriaId: string) {
    const categoria = Categories.find(cat => cat.value === categoriaId);
    if (categoria) {
      this.reporte.priority = categoria.priority as Priority;
    }
  }
  // =============================
  // UTILIDADES
  // =============================

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${inputLength + '/' + maxLength}`;
  }
}
