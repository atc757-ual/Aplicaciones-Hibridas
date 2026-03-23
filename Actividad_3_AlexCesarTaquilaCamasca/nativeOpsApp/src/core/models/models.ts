export interface SimpleReport {
    id: string;
    
    // Datos básicos
    title: string;
    description: string;
    category: string;
    
    // Evidencia
    photos: string[];               
    latitude: number;
    longitude: number;
    accuracy: number;
    
    // Estado
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    priority: 'high' | 'medium' | 'low';
    
    // Metadatos
    createdAt: string;               
    updatedAt: string;
    reporterName?: string;
}

