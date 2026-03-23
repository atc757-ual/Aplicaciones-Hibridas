import { Injectable } from '@angular/core';
import { SimpleReport } from 'src/core/models/models';
import { storageService, StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteServices {
  private STORAGE_KEY = 'reportes';

  constructor(private storageService: StorageService) {}

  async guardarReporte(reporte: SimpleReport): Promise<void> {
    const reportes = await this.obtenerReportes();
    reportes.push(reporte);
    await this.storageService.setItem(this.STORAGE_KEY, reportes);
  }

  async obtenerReportes(): Promise<SimpleReport[]> {
    return await this.storageService.getItem(this.STORAGE_KEY) || [];
  }
}