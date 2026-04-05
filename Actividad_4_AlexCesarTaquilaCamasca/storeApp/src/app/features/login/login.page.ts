import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastController, LoadingController } from '@ionic/angular';
import {
  IonButton,
  IonText,
  IonContent,
  IonTitle,
  IonCardHeader,
  IonCardContent,
  IonToolbar,
  IonHeader,
  IonImg,
  IonInput,
  IonInputPasswordToggle,
  NavController,
  IonBackButton,
  IonCard,
} from '@ionic/angular/standalone';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { arrowBackOutline,closeCircleOutline,checkmarkCircleOutline,eye,eyeOff } from 'ionicons/icons';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonTitle,
    IonToolbar,
    IonText,
    IonContent,
    IonHeader,
    IonCard,
    IonInputPasswordToggle,
    IonCardHeader,
    IonCardContent,
    IonImg,
    IonInput,
    IonBackButton,
    RouterLink
  ],
})
export class LoginPage {
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private navCtrl: NavController) {
    addIcons({ arrowBackOutline, closeCircleOutline, checkmarkCircleOutline, eye, eyeOff });
  }

  ngOnInit() {}

  async login() {

    if (this.loginForm.invalid) {
      this.showErrorMessage('Por favor, completa los campos correctamente.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Validando tus credenciales...',
      spinner: 'crescent',
      duration: 5000,
    });


    await loading.present();

    const { email, password } = this.loginForm.value;
    try {
      await this.authService.login(email!, password!);
      this.showInfoMessage('Credenciales válidas, redirigiendo...');
      setTimeout(() => {
        this.navCtrl.navigateRoot(['/products']);
      }, 1500);
    }
    catch (error) {
      const code = (error as any)?.code || '';
      switch (code) {
      case 'auth/user-not-found':
        this.showErrorMessage('No se encontró una cuenta con este correo.'); ;
        break;
      case 'auth/invalid-credential':
        this.showErrorMessage('Credenciales incorrectas, por favor intenta de nuevo.'); 
        break;
      case 'auth/user-disabled':
        this.showErrorMessage('Tu cuenta ha sido deshabilitada. Contacta al soporte.'); 
        break;
      case 'auth/invalid-email':
      this.showErrorMessage('El formato del correo es inválido.'); 
      break;
      default:
        this.showErrorMessage('Error al iniciar sesión. Por favor, intenta de nuevo.'); 
      }
    }
    finally 
    {
      loading.dismiss();
    }
  }

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

  async showInfoMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      cssClass:"toast-success",
      icon: 'checkmark-circle-outline',

    });
    toast.present();
  }

  goBack() {
    this.navCtrl.navigateRoot(['/home']);
  }
}
