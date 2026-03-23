export interface SimpleReport {
    id: string;
    
    // Datos básicos
    title: string;
    description: string;
    
    
    // Evidencia
    photos: string[];               
    latitude: number;
    longitude: number;
    accuracy: number;
    
    // Estado
    category: string;
    status: 'pendiente' | 'en progreso' | 'resuelto' | 'rechazado';
    priority: 'alta' | 'media' | 'baja';
    
    //acepto términos y condiciones
    aceptoTerminos: boolean;

    // Metadatos
    createdAt: string;               
    updatedAt: string;
    reporterName?: string;
}

export const Categories = [
  { value: 'baches', label: 'Baches o Hundimientos',status: 'pendiente', priority: 'alta' },
  { value: 'basura', label: 'Basura acumulada',status: 'pendiente', priority: 'media' },
  { value: 'areas-verdes', label: 'Áreas verdes',status: 'pendiente', priority: 'baja' },
  { value: 'senalizacion', label: 'Señalización',status: 'pendiente', priority: 'media' },
  { value: 'drenaje', label: 'Drenaje - Agua - Fuga',status: 'pendiente', priority: 'alta' },
  { value: 'vandalismo', label: 'Vandalismo',status: 'pendiente', priority: 'alta' },
  { value: 'ruido', label: 'Ruido',status: 'pendiente', priority: 'media' },
  { value: 'otros', label: 'Otros',status: 'pendiente', priority: 'baja' }
];
