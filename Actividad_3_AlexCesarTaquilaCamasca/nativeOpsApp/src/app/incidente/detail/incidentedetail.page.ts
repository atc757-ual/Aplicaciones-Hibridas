import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCardContent, IonSpinner, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { ModelReport } from 'src/core/models/models';
import { ReporteService } from 'src/core/services/reporte-service';
import { DialogUtils } from 'src/core/utils/dialog.utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-incidentedetail',
  templateUrl:'./incidentedetail.page.html',
  styleUrls: ['./incidentedetail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCardContent, 
    IonSpinner, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel,
     IonBadge, CommonModule, FormsModule, RouterLink],
})
export class IncidentedetailPage implements OnInit {
  reportes: ModelReport[] = [];
  pagedReportes: ModelReport[] = [];
  isLoading: boolean = true;
  page = 1;
  pageSize = 6;
  totalPages = 1;
  resolvedCount = 0;
  unresolvedCount = 0;
  inProgressCount = 0;

  constructor(private reporteService: ReporteService) { }

  async ngOnInit() {
    this.reportes = await this.reporteService.getAll();
    this.totalPages = Math.ceil(this.reportes.length / this.pageSize) || 1;
    this.setPagedReportes();
    this.setStatusCounts();
    this.isLoading = false;
  }

  async verDetalle(reporteId: string) {
    // Aquí puedes implementar la lógica para mostrar el detalle del reporte
    await DialogUtils.alert('Esta funcionalidad se encuentra en construcción','No disponible','Entendido');
  }



  
  /** Lógica de paginación */
  setPagedReportes() {
    const start = (this.page - 1) * this.pageSize;
    this.pagedReportes = this.reportes.slice(start, start + this.pageSize);
    this.setStatusCounts();
  }

  setStatusCounts() {
    this.resolvedCount = this.reportes.filter(r => r.status && r.status.toLowerCase() === 'resuelto').length;
    this.unresolvedCount = this.reportes.filter(r => r.status && r.status.toLowerCase() === 'pendiente').length;
    this.inProgressCount = this.reportes.filter(r => r.status && r.status.toLowerCase() === 'en proceso').length;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.setPagedReportes();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.setPagedReportes();
    }
  }

}

