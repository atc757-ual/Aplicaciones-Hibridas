import { Component, ViewChild} from '@angular/core';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { DomSanitizer ,SafeResourceUrl} from '@angular/platform-browser'; //importamos el servicio DomSanitizer para manejar URLs seguras en Angular
import { MapPlugin } from 'src/core/plugins/maps-plugin'; //importamos el servicio MapaService para manejar la creación y manipulación de mapas en la aplicación
import { ModelReport,Categories, Priority} from 'src/core/models/model-photo';
import { ReportService } from 'src/core/services/report-service';
import { ToastPlugin } from 'src/core/plugins/toast-plugin';
import { NavController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { DeviceUtils } from 'src/core/utils/device-util';
import { LocationPlugin } from 'src/core/plugins/location-plugin';
import { CameraPlugin } from 'src/core/plugins/camera-plugin';
import { Dialog } from '@capacitor/dialog';

interface PhotoWithSafeUrl {
  url: string;                    
  safeUrl?: SafeResourceUrl; 
  latitude: number;
  longitude: number;
  accuracy: number;
}

@Component({
  selector: 'app-reportcreate',
  templateUrl: './reportcreate.page.html',
  styleUrls: ['./reportcreate.page.scss'],
  standalone: true,
  imports: [SharedIonicModule],
})
export class ReportcreatePage {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @ViewChild('modalMapa', { static: false }) modalMapa!: IonModal;

  expandedAccordions: string[] = [];
  isDesktop: boolean = false;
  categories = Categories;
  isLoadingSubmit = false;
  isLoadingGeo = false;
  hasPermisionGeo = false;
  isLoadingTakePicture = false;
  fotoMapaIndex: number | null = null;
  photos: PhotoWithSafeUrl[] = [];
  img?: SafeResourceUrl; 
  private resizeHandler = this.checkScreenSize.bind(this);

  // Usar el tipo extendido para las fotos
  reporte: ModelReport = {
    id: '', 
    title: '',
    description: '',
    photos: [], 
    category: '',
    status: 'pending', 
    priority: 'baja', 
    aceptoTerminos: false,
    createdAt: new Date().toISOString(),
  };

  constructor(
    private mapaService: MapPlugin,
    private locationService: LocationPlugin,
    private cameraService: CameraPlugin,
    private sanitizer: DomSanitizer,
    private reporteService: ReportService,
    private navCtrl: NavController,
  ) {
    window.addEventListener('resize', this.resizeHandler);
    this.checkScreenSize();
  }
  // En el ngOnInit verificamos si ya tenemos permiso de geolocalización para mostrar la interfaz adecuada al usuario
  async ngOnInit() {
    this.hasPermisionGeo = await this.locationService.isGeolocationPermissionGranted();
  }

  // En el ngOnDestroy limpiamos el event listener de resize y destruimos el mapa para liberar recursos
  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
    this.mapaService.destruirMapa();
  }

  // Lógica para solicitar permiso de geolocalización al usuario y mostrar un mensaje de confirmación
  async authorizarUbicacion() {
    this.isLoadingGeo = true;
    this.hasPermisionGeo =  await this.locationService.requestGeolocationPermission();
    ToastPlugin.show( this.hasPermisionGeo ? 'Permiso a ubicación otorgado': 'Permiso denegado.',{ duration: 'long', position: 'top' },);
    this.isLoadingGeo = false;
  }

  // Método para manejar el envío del formulario de creación de reporte, se llama desde el template cuando el usuario hace clic en el botón de enviar reporte
  async submitReport() {
   
    this.reporte.photos= this.photos.map((foto) => ({
      url: foto.url,
      latitude: foto.latitude,
      longitude: foto.longitude,
      accuracy: foto.accuracy
    }));
    this.isLoadingSubmit = true;
    this.reporteService.createReporte(this.reporte);
    setTimeout(() => {
         this.isLoadingSubmit = false;
         this.modal.present();
    }, 1000);
    
    //await this.presentToast('Se han otorgado permisos de ubicación');
    //await ToastUtils.show('Tu Reporte se ha generado correctamente, tu código es: ' + this.reporte.id, { duration: 'long', position: 'top' });
  }

  /**  Método para mostrar el mapa en un modal, se llama cuando el usuario hace clic en el botón de ver ubicación en la foto, se obtiene la foto correspondiente al índice y se crea el mapa con la ubicación de la foto **/
  onModalMapaPresent() {
    const foto = this.fotoMapaIndex !== null ? this.photos[this.fotoMapaIndex] : null;
    if (!foto) return;
    this.mapaService.crearMapa('mapa-container',foto.latitude,foto.longitude,foto.accuracy > 0 ? 15 : 13);
    this.mapaService.agregarMarcador(foto.latitude, foto.longitude);
  }
    

  public async takePicture(): Promise<void> {
    this.isLoadingTakePicture = true;

    // Verificar permiso de cámara
    const camGranted = await this.cameraService.isCameraPermissionGranted();
    if (!camGranted) {
      const camReq = await this.cameraService.requestCameraPermission();
      if (!camReq) {
        await Dialog.alert({ title: 'Permiso de cámara requerido', message: 'Debes autorizar el acceso a la cámara para tomar fotos.', buttonTitle: 'Entendido' });
        this.isLoadingTakePicture = false;
        return;
      }
    }

    // Limitar a 5 fotos por reporte para evitar saturar la interfaz y el almacenamiento
    if (this.photos.length >= 5) {
      this.isLoadingTakePicture = false;
      return;
    }

    // Tomar la foto inmediatamente
    let foto = null;
    try {
      foto = await this.cameraService.takePhoto();
    } catch (err) {
      console.error('Error al tomar foto:', err);
      this.isLoadingTakePicture = false;
      return;
    }

    if (!foto) {
      this.isLoadingTakePicture = false;
      return;
    }

    const webPath = foto.webPath ? foto.webPath : '';
    const photoEntry: PhotoWithSafeUrl = {
      url: webPath,
      latitude: 0,
      longitude: 0,
      accuracy: -1,
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(webPath)
    };

    this.photos.push(photoEntry);
    this.img = this.sanitizer.bypassSecurityTrustResourceUrl(webPath);

    // Obtener la ubicación en segundo plano y actualizar la foto cuando esté disponible
    (async () => {
      try {
        let granted = this.hasPermisionGeo;
        if (!granted) {
          granted = await this.locationService.requestGeolocationPermission();
          this.hasPermisionGeo = granted;
        }
        if (!granted) return;
        const position = await this.locationService.getCurrentPosition({ useCache: true, maxAgeMs: 300000, enableHighAccuracy: false, timeout: 5000 });
        if (!position) return;
        const idx = this.photos.findIndex(p => p.url === webPath);
        if (idx >= 0) {
          this.photos[idx].latitude = position.coords.latitude;
          this.photos[idx].longitude = position.coords.longitude;
          this.photos[idx].accuracy = position.coords.accuracy;
        }
      } catch (e) {
        console.warn('Fallo al obtener ubicación en background:', e);
      }
    })();

    this.isLoadingTakePicture = false;
  }

  // =============================
  // UTILIDADES
  // =============================

  /** Método para abrir el modal del mapa, se llama desde el template cuando el usuario hace clic en el botón de ver ubicación en la foto **/
  async abrirModalMapa(index: number) {
    this.fotoMapaIndex = index;
    await this.modalMapa.present();
  }

  /** Método para eliminar una foto del reporte, se llama desde el template cuando el usuario hace clic en el botón de eliminar foto **/
  public eliminarFoto(index: number): void {
    this.photos.splice(index, 1);
  }

  /** Método para navegar a la página de detalle de incidencias, se llama desde el template después de enviar un reporte exitosamente **/
  async verIndidencias() {
    await this.closeModal();
    this.navCtrl.navigateForward(['/report-list']);
  }

  /**  Método para cerrar el modal de confirmación después de enviar un reporte, se llama desde el template **/ 
  async closeModal() {
    if (this.modal) await this.modal.dismiss();
  }

  /**  Método para actualizar la prioridad del reporte en función de la categoría seleccionada, se llama desde el template cuando el usuario cambia la categoría **/
  onCategoriaChange(categoriaId: string) {
    const categoria = Categories.find((cat) => cat.value === categoriaId);
    if (categoria) {
      this.reporte.priority = categoria.priority as Priority;
    }
  }

  /** contador de caracteres para inputs, se puede usar en el template con: {{ customCounterFormatter(reporte.title.length, 100) }} */
  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${inputLength + '/' + maxLength}`;
  }

  /** Lógica para expandir acordeones en desktop y colapsar en móvil, se llama en el constructor y en el evento resize de la ventana */

  checkScreenSize() {
    this.isDesktop = DeviceUtils.isDesktop();
    this.isDesktop ? this.expandedAccordions = ['fotos', 'ubicacion','otros'] :  this.expandedAccordions = [];
  }

}
