import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import {  IonHeader,  IonTitle, IonToolbar, IonBackButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logoIonic } from 'ionicons/icons';

@Component({
  selector: 'app-header-app',
  templateUrl: './header-app.component.html',
  styleUrls: ['./header-app.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, NgIf, IonBackButton]
})
export class HeaderAppComponent {

  @Input() title: string = '';
  @Input() translucent: boolean = false;
  @Input() hideBack: boolean = false;

  constructor( 

  ) {
    addIcons({logoIonic,arrowBackOutline});
  }

}