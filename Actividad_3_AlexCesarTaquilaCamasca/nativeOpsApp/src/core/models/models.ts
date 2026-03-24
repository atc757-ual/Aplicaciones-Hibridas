
export interface ModelPhoto {
  url: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface ModelReport {
  id: string;
  // Datos básicos
  title: string;
  description: string;

  // Evidencia
  photos: ModelPhoto[];

  // Estado
  category: string;
  status: string;
  priority: Priority;

  //acepto términos y condiciones
  aceptoTerminos: boolean;

  // Metadatos
  createdAt: string;
  reporterName?: string;
}

export type Priority = "alta" | "media" | "baja";


export const Categories = [
  { value: 'baches', label: 'Baches o Hundimientos', priority: 'alta' },
  { value: 'basura', label: 'Basura acumulada', priority: 'media' },
  { value: 'areas-verdes', label: 'Áreas verdes', priority: 'baja' },
  { value: 'senalizacion', label: 'Señalización', priority: 'media' },
  { value: 'drenaje', label: 'Drenaje - Agua - Fuga', priority: 'alta' },
  { value: 'vandalismo', label: 'Vandalismo', priority: 'alta' },
  { value: 'ruido', label: 'Ruido', priority: 'media' },
  { value: 'otros', label: 'Otros', priority: 'baja' }
];
