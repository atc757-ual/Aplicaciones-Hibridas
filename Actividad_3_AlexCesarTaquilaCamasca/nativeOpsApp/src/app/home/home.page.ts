import { RouterLink, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonItem,
    IonLabel,
    IonIcon,
    RouterLink,
    RouterModule,
  ],
})
export class HomePage {
  
  constructor() {
    
  }
}
