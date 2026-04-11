import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import {  IonHeader,  IonTitle, IonToolbar, IonBackButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logoIonic } from 'ionicons/icons';

@Component({
  selector: 'app-header-app',
  templateUrl: './header-app.html',
  styleUrls: ['./header-app.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, NgIf, IonBackButton]
})
export class HeaderApp {

  @Input() title: string = '';
  @Input() translucent: boolean = false;
  @Input() hideBack: boolean = false;
  @Input() defaultHref: string = '/reservations';

  constructor( 

  ) {
    addIcons({logoIonic,arrowBackOutline});
  }

}