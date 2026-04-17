import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class LocationPlugin {
  private lastPosition: Position | null = null;
  private lastPositionTs: number = 0;

  private isPositionValid(pos: Position | null): boolean {
    if (!pos) return false;
    const c: any = (pos as any).coords;
    if (!c) return false;
    const lat = Number(c.latitude);
    const lng = Number(c.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0 && typeof c.accuracy === 'undefined');
  }

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

    // Devolver cache si está dentro del maxAge y contiene datos válidos
    if (useCache && this.lastPosition && (Date.now() - this.lastPositionTs) <= maxAgeMs && this.isPositionValid(this.lastPosition)) {
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
      // Guardar en cache sólo si la posición es válida
      if (this.isPositionValid(position)) {
        this.lastPosition = position;
        this.lastPositionTs = Date.now();
      }
      return position;
    } catch (error: any) {
      // Si el usuario negó el permiso, limpiar cache y no mostrar un error crítico
      if (error && (error.code === 1 || /denied/i.test(error.message || ''))) {
        this.lastPosition = null;
        this.lastPositionTs = 0;
        console.warn('Permiso de geolocalización denegado por el usuario');
        return null;
      }
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
      // Preferir Permissions API cuando esté disponible para distinguir estados
      try {
        if (typeof window !== 'undefined' && 'navigator' in window) {
          // @ts-ignore
          if ('permissions' in navigator) {
            try {
              // @ts-ignore
              const status = await navigator.permissions.query({ name: 'geolocation' });
              if (status.state === 'granted') {
                // Intentar obtener posición para cachearla (no fuerza prompt)
                try {
                  const pos = await new Promise<Position>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
                  if (this.isPositionValid(pos)) {
                    this.lastPosition = pos as any;
                    this.lastPositionTs = Date.now();
                  }
                } catch (e) {
                  // ignore
                }
                return true;
              }
              if (status.state === 'denied') {
                return false;
              }
              // state === 'prompt' -> intentar solicitar permiso (requiere gesto del usuario)
            } catch (e) {
              // permisos no disponibles, seguiremos a fallback
            }
          }

          // Fallback: intentar solicitar la posición para provocar el prompt.
          return await new Promise<boolean>((resolve) => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  try {
                    const pos = position as any;
                    if (this.isPositionValid(pos)) {
                      this.lastPosition = pos;
                      this.lastPositionTs = Date.now();
                    }
                  } catch (e) {
                    // noop
                  }
                  resolve(true);
                },
                () => resolve(false)
              );
            } else {
              resolve(false);
            }
          });
        }
      } catch (e) {
        // ignore and return false
      }
      return false;
    }
    const geoPerm = await Geolocation.requestPermissions();
    return geoPerm.location === 'granted';
  }

}

