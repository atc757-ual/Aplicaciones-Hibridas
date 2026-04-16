import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class LocationPlugin {
  private lastPosition: Position | null = null;
  private lastPositionTs: number = 0;

  /**
   * Limpia la posición cacheada
   */
  clearCachedPosition() {
    this.lastPosition = null;
    this.lastPositionTs = 0;
  }
  /**
   * Obtiene la ubicación actual del dispositivo
   */
  async getCurrentPosition(options?: {
    useCache?: boolean;
    maxAgeMs?: number;
    enableHighAccuracy?: boolean;
    timeout?: number;
  }): Promise<Position | null> {
    const useCache = options?.useCache ?? false;
    const maxAgeMs = options?.maxAgeMs ?? 300000; // 5 min por defecto

    // Devolver cache si está dentro del maxAge
    if (useCache && this.lastPosition && (Date.now() - this.lastPositionTs) <= maxAgeMs) {
      return this.lastPosition;
    }

    try {
      const platform = Capacitor.getPlatform();
      // Construir opciones para Capacitor Geolocation
      const geoOptions: any = {};
      if (typeof options?.enableHighAccuracy !== 'undefined') geoOptions.enableHighAccuracy = options?.enableHighAccuracy;
      if (typeof options?.timeout !== 'undefined') geoOptions.timeout = options?.timeout;
      // Intentar obtener posición real
      const position = await Geolocation.getCurrentPosition(geoOptions);
      // Guardar en cache
      this.lastPosition = position;
      this.lastPositionTs = Date.now();
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
    const platform = Capacitor.getPlatform();
    // En web (navegador) usamos la API de navigator; en nativo usar el plugin de Capacitor
    if (platform === 'web') {
      if (typeof window !== 'undefined' && 'navigator' in window && 'permissions' in navigator) {
        try {
          // @ts-ignore
          const result = await navigator.permissions.query({ name: 'geolocation' });
          return result.state === 'granted';
        } catch {}
      }
      return false;
    }
    const geoPerm = await Geolocation.checkPermissions();
    return geoPerm.location === 'granted';
  }

  /**
   * Solicita permiso de geolocalización al usuario
   */
  async requestGeolocationPermission(): Promise<boolean> {
    const platform = Capacitor.getPlatform();
    // En web usamos navigator; en nativo solicitamos mediante el plugin de Capacitor
    if (platform === 'web') {
      return new Promise((resolve) => {
        if (typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            () => resolve(false)
          );
        } else {
          resolve(false);
        }
      });
    }
    const geoPerm = await Geolocation.requestPermissions();
    return geoPerm.location === 'granted';
  }

}

