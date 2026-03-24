import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage';
import { ModelReport } from '../models/models';

import { Camera } from '@capacitor/camera';
import { Geolocation  } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {

  /** Clave de almacenamiento para los reportes */
  private storageKey = 'Reporte';

  /* Inyectamos el servicio de almacenamiento para manejar la persistencia de los reportes */
  constructor(private storageService: StorageService) {}

  async getAll(): Promise<ModelReport[]> {
    return (await this.storageService.getItems<ModelReport[]>(this.storageKey)) || [];
  }
  async add(reporte: ModelReport): Promise<void> {
    const reportes = await this.getAll();
    reportes.push(reporte);
    await this.storageService.setItem(this.storageKey, reportes);
  }
  async update(id: string, changes: Partial<ModelReport>): Promise<void> {
    const reportes = await this.getAll();
    const idx = reportes.findIndex(r => r.id === id);
    if (idx !== -1) {
      reportes[idx] = { ...reportes[idx], ...changes };
      await this.storageService.setItem(this.storageKey, reportes);
    }
  }
  async delete(id: string): Promise<void> {
    let reportes = await this.getAll();
    reportes = reportes.filter(r => r.id !== id);
    await this.storageService.setItem(this.storageKey, reportes);
  }
  async getById(id: string): Promise<ModelReport | undefined> {
    const reportes = await this.getAll();
    return reportes.find(r => r.id === id);
  }


  /**
   * Consulta si el permiso de cámara está concedido
   */
  async isCameraPermissionGranted(): Promise<boolean> {
    const cameraPerm = await Camera.checkPermissions();
    return cameraPerm.camera === 'granted';
  }

  /**
   * Solicita permiso de cámara al usuario
   */
  async requestCameraPermission(): Promise<boolean> {
    const cameraPerm = await Camera.requestPermissions({ permissions: ['camera'] });
    return cameraPerm.camera === 'granted';
  }

  /**
   * Consulta si el permiso de geolocalización está concedido
   */
  async isGeolocationPermissionGranted(): Promise<boolean> {
    // Fallback para web
    if (typeof window !== 'undefined' && 'navigator' in window && 'permissions' in navigator) {
      try {
        // @ts-ignore
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state === 'granted';
      } catch {
        // Si falla, intentamos con el plugin de Capacitor
      }
    }
    // Capacitor (móvil)
    const geoPerm = await Geolocation.checkPermissions();
    return geoPerm.location === 'granted';
  }

  /**
   * Solicita permiso de geolocalización al usuario
   */
  async requestGeolocationPermission(): Promise<boolean> {
    // Fallback para web
    if (typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        );
      });
    }
    // Capacitor (móvil)
    const geoPerm = await Geolocation.requestPermissions();
    return geoPerm.location === 'granted';
  }


}

