import { ModelReport } from '../models/models';

export const REPORTES_SEED: ModelReport[] = [
  {
    id: 'RI-1001',
    title: 'Bache peligroso en avenida',
    description: 'Hay un bache grande y profundo en la Av. Central, frente al colegio.',
    category: 'baches',
    photos: [
      {
        url: 'https://via.placeholder.com/300x200?text=Incidente+1',
        latitude: -12.0464,
        longitude: -77.0428,
        accuracy: 5
      }
    ],
    aceptoTerminos: true,
    status: 'pendiente',
    priority: 'alta',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RI-1002',
    title: 'Basura acumulada en parque',
    description: 'El parque principal tiene bolsas de basura sin recoger desde hace días.',
    category: 'basura',
    photos: [
      {
        url: 'https://via.placeholder.com/300x200?text=Incidente+2',
        latitude: -12.0453,
        longitude: -77.0311,
        accuracy: 8
      }
    ],
    aceptoTerminos: true,
    status: 'en proceso',
    priority: 'media',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RI-1003',
    title: 'Fuga de agua en esquina',
    description: 'Se observa fuga de agua en la esquina de Av. Lima con Jr. Arequipa.',
    category: 'drenaje',
    photos: [
      {
        url: 'https://via.placeholder.com/300x200?text=Incidente+3',
        latitude: -12.0432,
        longitude: -77.0283,
        accuracy: 10
      }
    ],
    aceptoTerminos: true,
    status: 'resuelto',
    priority: 'alta',
    createdAt: new Date().toISOString(),
  },
];
