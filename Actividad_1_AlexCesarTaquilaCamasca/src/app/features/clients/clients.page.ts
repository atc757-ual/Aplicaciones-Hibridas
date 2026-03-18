import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonList, IonLabel, IonItem, IonIcon, IonAvatar, IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { HeaderAppComponent } from '../../shared/components/header-app/header-app.component';
import { Client, ClientsService } from '../../core/services/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: 'clients.page.html',
  styleUrls: ['clients.page.scss'],
  imports: [IonList, IonIcon, IonAvatar, IonItem, IonLabel, IonContent, IonSearchbar, NgFor, NgIf, RouterLink, HeaderAppComponent],
})
export class ClientsPage {
  protected readonly clients: Client[];
  protected filterText = '';

  constructor(private readonly clientsService: ClientsService) {
    this.clients = this.clientsService.clients;
    addIcons({ searchOutline });
  }

  protected get filteredClients(): Client[] {
    const term = this.filterText.toLowerCase();
    if (!term) return this.clients;
    return this.clients.filter(
      (c) => c.name.toLowerCase().includes(term) || c.role.toLowerCase().includes(term),
    );
  }

  protected onSearch(event: Event): void {
    this.filterText = (event as CustomEvent).detail.value ?? '';
  }
}
