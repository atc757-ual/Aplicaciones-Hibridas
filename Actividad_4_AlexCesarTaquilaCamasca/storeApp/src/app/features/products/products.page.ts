import { Component, inject, ViewChildren, OnInit, ViewChild, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonThumbnail,IonList,IonHeader,IonCardContent,IonCard,IonBackButton,
  IonIcon, IonLabel, IonItem, IonTitle, IonToolbar,IonButtons,IonButton, IonPopover,
  IonCardTitle ,IonCardHeader, NavController,IonImg, IonModal,IonItemOptions, IonItemSliding,
   IonItemOption} from '@ionic/angular/standalone';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductsService } from '../../core/services/products.service';
import { addCircleOutline,closeCircleOutline,checkmarkCircleOutline, informationCircleOutline,
  logOutOutline,searchOutline,trashOutline} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ToastController, LoadingController } from '@ionic/angular';
import { Product } from 'src/app/core/models/product.model';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonModal,IonTitle, IonButtons,IonIcon,IonCardTitle,
    IonBackButton, IonButton, IonCard, IonCardHeader, IonCardContent, IonItem, IonLabel, IonThumbnail, RouterLink, IonImg,
     IonList, IonItemSliding, IonItemOptions, IonItemOption, FormsModule, CommonModule,IonPopover]
})
export class ProductsPage {
  public productService = inject(ProductsService);
  public userService = inject(UsersService);

  private authService = inject(AuthService); 
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  private productToDelete: any = null; 
  productToDetail: Product | null = null;
  isValidSession = {isLoaded: false, isLogged: false};

  @ViewChild('modal', { static: false }) modal!: IonModal;
  @ViewChild('modalDetail', { static: false }) modalDetail!: IonModal;

  constructor( private navController : NavController) {
    addIcons({ addCircleOutline, logOutOutline, trashOutline,searchOutline,
    closeCircleOutline,checkmarkCircleOutline, informationCircleOutline});
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLogged => {
        this.isValidSession.isLogged = isLogged;
        this.isValidSession.isLoaded = true;
      });
  }
/* Navegar a detalle del producto desde el botón */
  goToAddProduct() { 
    this.navController.navigateForward(['/add-product']);
  }


/* Abrir Modal al hacer Swipe*/
openModalDelete(productId: string, slidingItem: IonItemSliding) {
  if (this.modal) {
    this.productToDelete = productId;
    this.modal.present();
  }
  slidingItem.close();
}

/*Abrir modal al hacer swipe */
openModalDetail(product: Product, slidingItem: IonItemSliding) {
  if (this.modalDetail) {
    this.productToDetail = product;
    this.modalDetail.present();
  }
  slidingItem.close();
}

/* Confirmar eliminación del producto */
async confirmDelete() {
  const loading = await this.loadingController.create({
      message: 'Eliminando producto...',
      spinner: 'crescent',
      duration: 5000,
  });
  await loading.present();

  if (this.productToDelete) {
      try { 
      await this.productService.deleteProduct(this.productToDelete);
      this.showSuccessMessage('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      } finally {
        this.productToDelete = null;  
        loading.dismiss();
        this.modal.dismiss();
      }
    
    }
  }

/* Logout del usuario */
  logout() { 
    this.authService.logout();
    this.navController.navigateRoot(['/login']);
  }

/* Mostrar mensajes de error o información */
  async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      cssClass: 'toast-error',
      icon: 'close-circle-outline',
    });
    toast.present();
  }
  async showSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      cssClass:"toast-success",
      icon: 'checkmark-circle-outline',

    });
    toast.present();
  }
}
