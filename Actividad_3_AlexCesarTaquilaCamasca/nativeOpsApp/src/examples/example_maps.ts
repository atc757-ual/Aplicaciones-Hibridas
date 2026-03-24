// src/app/pages/mapa/mapa.page.ts
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MapaService } from '../core/utils/maps.utils';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './example_maps.html',
  styleUrls: ['./example_maps.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ExampleMapsPage implements AfterViewInit, OnDestroy {
  constructor(private mapaService: MapaService) {}

  ngAfterViewInit() {
    // Coordenadas de Lima, Perú
    const lat = -12.046374;
    const lng = -77.042793;
    // Crear el mapa
    this.mapaService.crearMapa('mapa-container', lat, lng, 13);
    // Solución para el tamaño del mapa
    setTimeout(() => {
      this.mapaService.getMapa()?.invalidateSize();
    }, 200);
    // Agregar un marcador
    this.mapaService.agregarMarcador(lat, lng, 'Lima', 'Capital del Perú');
    // Agregar más marcadores de ejemplo
    this.mapaService.agregarMultiplesMarcadores([
      { lat: -12.119, lng: -77.034, titulo: 'Miraflores', popup: 'Zona turística' }
    ]);
  }

  ngOnDestroy() {
    this.mapaService.destruirMapa();
  }

  // Agregar en mapa.page.ts
    centrarEnLima() {
    this.mapaService.centrarEn(-12.046374, -77.042793, 13);
    }
}