import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logoIonic } from 'ionicons/icons';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-header-app',
  templateUrl: './header-app.component.html',
  styleUrls: ['./header-app.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, NgIf]
})
export class HeaderAppComponent {

  @Input() title: string = '';
  @Input() translucent: boolean = false;
  @Input() hideBack: boolean = false;

  constructor( 
    private navCtrl: NavController,
    private location: Location
  ) {
    addIcons({logoIonic,arrowBackOutline});
  }

  goBack(): void {
    try {
      this.navCtrl.back();
    } catch (e) {
      this.navCtrl.navigateRoot('/reservations'); 
    }
  }
}
