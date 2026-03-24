import { Component, OnInit } from '@angular/core';
import { ModelReport } from 'src/core/models/models';
import { ReporteService } from 'src/core/services/reporte-service';
import { DialogUtils } from 'src/core/utils/dialog.utils';
import { SharedIonicModule } from '../../shared/shared-ionic.module';

@Component({
  selector: 'app-incidentedetail',
  templateUrl:'./incidentedetail.page.html',
  styleUrls: ['./incidentedetail.page.scss'],
  standalone: true,
  imports: [SharedIonicModule]
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
    this.reportes = await this.reporteService.getItems();
    this.totalPages = Math.ceil(this.reportes.length / this.pageSize) || 1;
    this.setPagedReportes();
    this.setStatusCounts();
    this.isLoading = false;
  }

  async verDetalle(reporteId: string) {
    // Aquí puedes implementar la lógica para mostrar el detalle del reporte
    await DialogUtils.alert('Esta funcionalidad se encuentra en construcción','No disponible','Entendido');
  }


/* Lógica para paginar los reportes, se llama cada vez que se cambia de página o cuando se cargan los reportes por primera vez */
  setPagedReportes() {
    const start = (this.page - 1) * this.pageSize;
    this.pagedReportes = this.reportes.slice(start, start + this.pageSize);
    this.setStatusCounts();
  }

/** Lógica para contar los reportes por estado */
  setStatusCounts() {
    this.resolvedCount = this.reportes.filter(r => r.status && r.status.toLowerCase() === 'resuelto').length;
    this.unresolvedCount = this.reportes.filter(r => r.status && r.status.toLowerCase() === 'pendiente').length;
    this.inProgressCount = this.reportes.filter(r => r.status && r.status.toLowerCase() === 'en proceso').length;
  }
  /** Lógica para navegar a la página de detalle del reporte, se llama desde el template cuando el usuario hace clic en un reporte */
  async goToDetalle(reporteId: string) {
    await DialogUtils.alert('Esta funcionalidad se encuentra en construcción','No disponible','Entendido');
  }

  /** Logica para navegar hacia adelante entre los reportes */
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.setPagedReportes();
    }
  }
    
 /** Logica para navegar hacia atrás entre los reportes */
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.setPagedReportes();
    }
  }

}

