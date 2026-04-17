import { RouterLink, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { ReportService } from 'src/core/services/report-service';
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
  IonBadge,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { ModelReport } from 'src/core/models/model-photo';
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
    IonBadge,
    RouterModule,
  ],
})
export class HomePage {
    countReports: number = 0;
  
    constructor(private reporteService: ReportService) { }
  
    async ionViewWillEnter() {
      this.countReports = (await this.reporteService.getItems()).length;
    }
  


}
