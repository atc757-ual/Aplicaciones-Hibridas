import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonCard, IonIcon,IonCardContent, IonInput, IonInputOtp, IonItem, IonLoading, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonButton,
    IonCard,
    IonIcon,
    IonCardContent,
    IonInput,
    IonInputOtp,
    IonItem,
    IonLoading,
    NgIf,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  protected showCodeStep = false;
  protected loading = false;


  protected loginForm = this.formBuilder.group({
    mobile: [''],
    code: [''],
  });

  get showMobileError(): boolean {
    const control = this.loginForm.get('mobile');
    const value = control?.value ?? '';
    return !!control && control.touched && typeof value === 'string' && value.length > 0 && !value.startsWith('6');
  }

  get isMobileValid(): boolean {
    const value = this.loginForm.get('mobile')?.value ?? '';
    return typeof value === 'string' && value.length === 9 && value.startsWith('6');
  }

  get mobileLast4(): string {
    const value = this.loginForm.get('mobile')?.value || '';
    return value.length === 9 ? value.slice(-4) : '____';
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    
  ) {addIcons({arrowBackOutline})}

  goBack() {
    this.showCodeStep = false;
    this.loginForm.get('code')?.setValue('');
  }


  ngOnInit() {
    this.resetLogin();
  }

  ionViewWillEnter() {
    this.resetLogin();
  }

  resetLogin() {
    this.showCodeStep = false;
    this.loginForm.reset({ mobile: '', code: '' });
  }

  protected loadingMessage = '';

  protected async goToCodeStep(): Promise<void> {
    if (!this.isMobileValid) return;
    this.loadingMessage = 'Enviando código OTP';
    this.loading = true;
    await new Promise(res => setTimeout(res, 1000));
    this.loading = false;
    this.showCodeStep = true;
  }

  protected async submitLogin(): Promise<void> {
    this.loadingMessage = 'Validando sesión';
    this.loading = true;
    await new Promise(res => setTimeout(res, 850));
    this.loading = false;
    setTimeout(() => {
      this.router.navigateByUrl('/reservations');
    }, 10);
  }

  protected async onOtpChange(event: any): Promise<void> {
    const value = event?.detail?.value || '';
    if (value && value.length === 6) {
      await this.submitLogin();
    }
  }

}
