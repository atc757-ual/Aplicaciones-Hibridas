// src/app/services/mapa.service.ts
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución para el problema de los iconos de Leaflet en Ionic
const iconRetinaUrl = './assets/img/marker-icon-2x.png';
const iconUrl = './assets/img/marker-icon.png';
const shadowUrl = './assets/img/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Injectable({
  providedIn: 'root'
})
export class MapPlugin {
  private mapa: L.Map | null = null;

  /**
   * Crear el mapa con Leaflet
   */
  crearMapa(
    elementId: string,
    lat: number,
    lng: number,
    zoom: number = 10
  ): L.Map {
    const elemento = document.getElementById(elementId);
    if (!elemento) {
      throw new Error(`Elemento con id "${elementId}" no encontrado`);
    }

    // Destruir mapa existente si hay
    if (this.mapa) {
      this.mapa.remove();
    }

    // Crear nuevo mapa
    this.mapa = L.map(elementId).setView([lat, lng], zoom);

    // Agregar capa de OpenStreetMap (gratuita)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.mapa);

    return this.mapa;
  }

  /**
   * Agregar un marcador
   */
  agregarMarcador(
    lat: number,
    lng: number,
    titulo?: string,
    popupTexto?: string
  ): L.Marker {
    if (!this.mapa) {
      throw new Error('Mapa no inicializado');
    }

    const marker = L.marker([lat, lng]).addTo(this.mapa);

    if (titulo) {
      marker.bindPopup(popupTexto || titulo);
      if (popupTexto) {
        marker.bindPopup(`<b>${titulo}</b><br>${popupTexto}`);
      } else {
        marker.bindPopup(titulo);
      }
    }

    return marker;
  }

  /**
   * Agregar múltiples marcadores
   */
  agregarMultiplesMarcadores(
    marcadores: Array<{ lat: number; lng: number; titulo?: string; popup?: string }>
  ): L.Marker[] {
    const markers: L.Marker[] = [];
    for (const m of marcadores) {
      const marker = this.agregarMarcador(m.lat, m.lng, m.titulo, m.popup);
      markers.push(marker);
    }
    return markers;
  }

  /**
   * Centrar el mapa en una posición
   */
  centrarEn(lat: number, lng: number, zoom?: number): void {
    if (!this.mapa) return;
    this.mapa.setView([lat, lng], zoom ?? this.mapa.getZoom());
  }

  /**
   * Obtener el mapa actual
   */
  getMapa(): L.Map | null {
    return this.mapa;
  }

  /**
   * Destruir el mapa
   */
  destruirMapa(): void {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = null;
    }
  }
}