import { ActionSheetUtils } from '../core/plugins/actionsheet-plugin';
import { DialogUtils } from '../core/plugins/dialog-plugin';

export class MiComponente {
  
  // Ejemplo 1: Solo opciones (más simple)
  async menuSimple() {
    const seleccion = await ActionSheetUtils.show(
      ['Editar', 'Duplicar', 'Eliminar']
    );
    
    if (seleccion !== -1) {
      await DialogUtils.alert(`Seleccionaste: ${['Editar', 'Duplicar', 'Eliminar'][seleccion]}`);
    }
  }
  
  // Ejemplo 2: Con título
  async menuConTitulo() {
    const seleccion = await ActionSheetUtils.show(
      ['Compartir', 'Guardar', 'Imprimir'],
      'Opciones de archivo'
    );
    
    if (seleccion !== -1) {
      // Procesar selección...
    }
  }
  
  // Ejemplo 3: Con título y mensaje (solo visible en iOS)
  async menuCompleto() {
    const seleccion = await ActionSheetUtils.show(
      ['Cámara', 'Galería', 'Archivo'],
      'Seleccionar origen',
      'Elige de dónde quieres obtener la imagen',
      true  // cancelable: se puede cerrar tocando fuera
    );
    
    switch(seleccion) {
      case 0: /* Abrir cámara */ break;
      case 1: /* Abrir galería */ break;
      case 2: /* Seleccionar archivo */ break;
      default: /* Cancelado */ break;
    }
  }
  
  // Ejemplo 4: Usando showWithOptions para mayor claridad
  async menuConObjeto() {
    const seleccion = await ActionSheetUtils.showWithOptions(
      [
        { title: 'Editar' },
        { title: 'Duplicar' },
        { title: 'Eliminar' }
      ],
      'Gestionar elemento'
    );
    
    if (seleccion !== -1) {
      // Procesar...
    }
  }
}