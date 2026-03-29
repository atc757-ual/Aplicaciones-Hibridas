
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingController,ToastController} from '@ionic/angular/standalone';
import { FormGroup,FormControl,Validators,ReactiveFormsModule,} from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { IonicModule } from '@ionic/angular';
import {closeCircleOutline,checkmarkCircleOutline, imageOutline} from 'ionicons/icons';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddProductPage  {

imgenFile?: { 
  name: string;
  file: File;     
  localUrl: string;
};

constructor() {
  addIcons({ closeCircleOutline,checkmarkCircleOutline,imageOutline});
}

private productService = inject(ProductsService);
private router = inject(Router);
private loadingController = inject(LoadingController);
private toastController = inject(ToastController);

  productForm = new FormGroup({
    descripcion: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    descuento: new FormControl(0, [Validators.min(0), Validators.max(100)]),
    unidades: new FormControl('', [Validators.required, Validators.min(0)]),
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),  
    imagenfile: new FormControl()
  });

  async addProduct() {
  if (this.productForm.invalid) return;
    const loading = await this.loadingController.create({
    message: 'Guardando...',
    });

    await loading.present();

    try {
      // Enviamos el objeto tal cual sale del formulario
      await this.productService.addProduct(this.productForm.value as any); 
      this.showSuccessMessage('Producto añadido');
      this.router.navigate(['/products']);
      } 
      catch (error) {
      this.showErrorMessage('Error al guardar');
      } 
      finally {
      loading.dismiss(); 
      }
  }

  
  onFileSelected(event: any) {
    // Reiniciar el valor para permitir seleccionar el mismo archivo nuevamente
    this.productForm.get('imageUrl')?.setValue(null); 

    // Obtener el archivo seleccionado
    const file: File = event.target.files[0];
    if (!file) {
      this.productForm.get('imagenfile')?.setValue(null);
      return;
    }

    // Validar tipo
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.showErrorMessage('Archivo no permitido');
      this.productForm.get('imagenfile')?.setValue(null);
      return;
    }

    this.productForm.get('imagenfile')?.setValue({ name: file.name, file, localUrl: URL.createObjectURL(file) });
    this.productForm.get('imageUrl')?.setValue('');
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

    // Eliminar imagen cargada
  clearSelectedImage() {
    this.productForm.get('imagenfile')?.setValue(null);
  }
  // Eliminar imagen cargada al ingresar una URL
  clearImageUrl(){
    this.productForm.get('imageUrl')?.setValue('');
  }
  // Limpiar imagen local si se ingresa una URL
  onImageUrlInput() {
    if (this.productForm.get('imageUrl')?.value) {
      this.clearSelectedImage();
    }
  }
}
