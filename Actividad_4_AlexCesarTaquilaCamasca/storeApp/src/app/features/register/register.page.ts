import { Component, inject, OnInit } from '@angular/core';
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
  NavController,
  IonBackButton,
  IonCard,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { arrowBackOutline,checkmarkCircleOutline,eyeOff,eye, closeCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { UsersService } from 'src/app/core/services/users.service';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonCardHeader,
    IonCardContent,
    IonImg,
    IonInput,
    IonBackButton,
    IonInputPasswordToggle
  ],
})
export class RegisterPage implements OnInit {

  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(6),]),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private navCtrl: NavController) {
    addIcons({ arrowBackOutline, closeCircleOutline, checkmarkCircleOutline, eyeOff, eye });
  }

  ngOnInit() {}

  async register () {

    if (this.registerForm.invalid) {
      this.showErrorMessage('Por favor, completa los campos correctamente.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Validando los datos ingresados...',
      spinner: 'crescent',
      duration: 2000,
    });

    await loading.present();

    try {
      await this.userService.addUser({
        nombre: this.registerForm.value.name!,
        apellidos: this.registerForm.value.lastName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        passwordConfirm: this.registerForm.value.confirmPassword!,
        createAt: new Date()
      });

      // Firebase inicia sesión automáticamente al crear usuario; la cerramos para forzar login manual.
      await this.authService.logout();

      this.showInfoMessage('Registro exitoso, redirigiendo a login...');
      setTimeout(() => {
        this.navCtrl.navigateRoot(['/login']);
      }, 2200);
    }
    catch (error) {
      const code = (error as any)?.code || '';
      console.log(code);
      if(code === 'auth/email-already-in-use') {
        this.showErrorMessage('El correo electrónico ya está en uso.'); ;
      } else {
        this.showErrorMessage('Error al registrar, por favor intenta de nuevo.');
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

  onInputFilter(event: any, controlName: string){
  const input = event.target as HTMLIonInputElement;
  let value = input.value as string;
  const regex = /[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g;
  const filteredValue = value.replace(regex, '');
  if (value !== filteredValue) {
    input.value = filteredValue;
    this.registerForm.get(controlName)?.setValue(filteredValue, { emitEvent: false });
  }
}
}