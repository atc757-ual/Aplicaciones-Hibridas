import { Component, OnInit } from '@angular/core';
import { ModelReport } from 'src/core/models/model-photo';
import { ReportService } from 'src/core/services/report-service';
import { DialogPlugin } from 'src/core/plugins/dialog-plugin';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { RouterLink } from '@angular/router';
import { CapitalizePipe } from 'src/app/pipes/capitalize.pipe';

@Component({
  selector: 'app-reportlist',
  templateUrl:'./reportlist.page.html',
  styleUrls: ['./reportlist.page.scss'],
  standalone: true,
  imports: [SharedIonicModule, RouterLink, CapitalizePipe]
})
export class ReportlistPage implements OnInit {
  reportes: ModelReport[] = [];
  pagedReportes: ModelReport[] = [];
  isLoading: boolean = true;
  page = 1;
  pageSize = 6;
  totalPages = 1;
  resolvedCount = 0;
  unresolvedCount = 0;
  inProgressCount = 0;

  constructor(private reporteService: ReportService) { }

  async ngOnInit() {
    await this.loadReports();
  }

  // Recargar lista cada vez que la vista entra en pantalla (navegación/volver desde modal)
  async ionViewWillEnter() {
    await this.loadReports();
  }

  private async loadReports() {
    this.isLoading = true;
    this.reportes = (await this.reporteService.getItems()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.totalPages = Math.max(1, Math.ceil(this.reportes.length / this.pageSize));
    this.page = Math.min(this.page, this.totalPages);
    this.setPagedReportes();
    this.setStatusCounts();
    this.isLoading = false;
  }

  async verDetalle(reporteId: string) {
    // Aquí puedes implementar la lógica para mostrar el detalle del reporte
    await DialogPlugin.alert('Esta funcionalidad se encuentra en construcción','No disponible','Entendido');
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

  /** Devuelve un objeto de clases para usar con [ngClass] en badges */
  getBadgeClass(status?: string) {
    const s = (status || '').toLowerCase();
    return {
      success: s === 'resuelto',
      inprogress: s === 'en proceso' ,
      pending: s === 'pendiente'
    };
  }

  /** Etiqueta legible para mostrar dentro del badge */
  getBadgeLabel(status?: string) {
    const s = (status || '').toLowerCase();
    if (s === 'resuelto') return 'Resuelto';
    if (s === 'en proceso') return 'En atención';
    return 'Registrado';
  }

}

