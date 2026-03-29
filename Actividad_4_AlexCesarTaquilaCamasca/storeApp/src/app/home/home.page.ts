import { Component } from '@angular/core';
import {  IonButton, IonImg,IonTitle,IonHeader } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [  IonButton, IonImg,IonTitle,IonHeader,RouterLink],
})
export class HomePage {
  constructor( ) {}
}
