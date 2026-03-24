import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  /**
   * Obtiene la ubicación actual del dispositivo
   */
  async getCurrentPosition(): Promise<Position | null> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return position;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return null;
    }
  }

  /**
   * Consulta si el permiso de geolocalización está concedido
   */
  async isGeolocationPermissionGranted(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'navigator' in window && 'permissions' in navigator) {
      try {
        // @ts-ignore
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state === 'granted';
      } catch {}
    }
    const geoPerm = await Geolocation.checkPermissions();
    return geoPerm.location === 'granted';
  }

  /**
   * Solicita permiso de geolocalización al usuario
   */
  async requestGeolocationPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        );
      });
    }
    const geoPerm = await Geolocation.requestPermissions();
    return geoPerm.location === 'granted';
  }

}

