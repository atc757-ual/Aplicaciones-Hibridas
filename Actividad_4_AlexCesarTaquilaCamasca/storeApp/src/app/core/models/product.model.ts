export interface Product {
    id: string;
    marca: string;
    modelo: string;
    descripcion: string;
    imageUrl: string;
    userId: string; 
    createAt: Date;
    precio: number;
    descuento: number;
    unidades: number;
    imagefile?: File;
}
