import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NgIf } from '@angular/common';
import {  IonContent,  IonIcon,  IonItem,  IonLabel,  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, businessOutline, locationOutline,
  calendarOutline, personCircleOutline } from 'ionicons/icons';
import { HeaderAppComponent } from '../../shared/components/header-app/header-app.component';
import { Client, ClientsService } from '../../core/services/clients.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: 'client-detail.page.html',
  styleUrls: ['client-detail.page.scss'],
  imports: [IonContent, IonList, IonItem, IonLabel, IonIcon, NgIf, HeaderAppComponent],
})

export class ClientDetailPage implements OnInit, AfterViewInit {
  protected client: Client | undefined;

  /*La página de detalle de cliente identifica el parametro
  utilizando @Input().*/
 @Input() id?: string;

  constructor(
    private readonly clientsService: ClientsService
  ) {
    addIcons({
      mailOutline,
      callOutline,
      businessOutline,
      locationOutline,
      calendarOutline,
      personCircleOutline
    });
  }

  ngOnInit(): void {
    let idToUse = typeof this.id === 'string' ? parseInt(this.id, 10) : this.id;
    if (typeof idToUse === 'number' && !isNaN(idToUse)) {
      this.client = this.clientsService.getById(idToUse);
    } else {
      this.client = undefined;
    }
  }

  ngAfterViewInit(): void {
    // Quitar el foco de cualquier elemento activo al cargar la vista
    if (document && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
