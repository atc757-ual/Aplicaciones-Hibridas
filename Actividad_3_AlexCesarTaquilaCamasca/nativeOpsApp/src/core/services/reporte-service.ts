import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage';
import { Categories, ModelReport, Priority } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  /** Clave de almacenamiento para los reportes */
  private storageKey = 'Reporte';

  /* Inyectamos el servicio de almacenamiento para manejar la persistencia de los reportes */
  constructor(private storageService: StorageService) {}

  async getItems(): Promise<ModelReport[]> {
    return (
      (await this.storageService.getItems<ModelReport[]>(this.storageKey)) || []
    );
  }

  async addItem(reporte: ModelReport): Promise<void> {
    const reportes = await this.getItems();
    reportes.push(reporte);
    await this.storageService.setItem(this.storageKey, reportes);
  }

  async updateItem(id: string, changes: Partial<ModelReport>): Promise<void> {
    const reportes = await this.getItems();
    const idx = reportes.findIndex((r) => r.id === id);
    if (idx !== -1) {
      reportes[idx] = { ...reportes[idx], ...changes };
      await this.storageService.setItem(this.storageKey, reportes);
    }
  }

  async deleteItem(id: string): Promise<void> {
    let reportes = await this.getItems();
    reportes = reportes.filter((r) => r.id !== id);
    await this.storageService.setItem(this.storageKey, reportes);
  }

  async getById(id: string): Promise<ModelReport | undefined> {
    const reportes = await this.getItems();
    return reportes.find((r) => r.id === id);
  }

 /**---- Lógica para manejo de reportes ----**/
 /** Lógica para crear un nuevo reporte, se llama desde el template después de que el usuario llena el formulario de creación de reporte*/ 
 
 async createReporte(reporte: ModelReport): Promise<void> {
    reporte.createdAt = new Date().toISOString();
    reporte.id = 'RI-' + Date.now();
    reporte.status = 'pendiente';
    reporte.priority =
      (Categories.find((cat) => cat.value === reporte.category)
        ?.priority as Priority) ?? 'baja';
    await this.addItem(reporte)
  }
}
