// core/utils/actionsheet.utils.ts
import { ActionSheet } from '@capacitor/action-sheet';

export interface ActionSheetOption {
  title: string;
}

export class ActionSheetUtilsPlugin {
  
  /**
   * Muestra una hoja de acciones con opciones
   * @param opciones Lista de opciones a mostrar
   * @param titulo Título opcional de la hoja
   * @param mensaje Mensaje opcional (solo iOS)
   * @param cancelable Si se puede cancelar tocando fuera (Android/Web, desde v8.1.0)
   * @returns índice de la opción seleccionada, o -1 si se canceló
   */
  static async show(
    opciones: string[],
    titulo?: string,
    mensaje?: string,
    cancelable: boolean = false
  ): Promise<number> {
    
    // Construir el array de opciones en el formato requerido
    const optionsArray: ActionSheetOption[] = opciones.map(opcion => ({
      title: opcion
    }));
    
    // Construir el objeto de opciones para showActions
    const showOptions: {
      title?: string;
      message?: string;
      options: ActionSheetOption[];
      cancelable?: boolean;
    } = {
      options: optionsArray
    };
    
    // Agregar título si se proporciona
    if (titulo) {
      showOptions.title = titulo;
    }
    
    // Agregar mensaje si se proporciona (solo visible en iOS)
    if (mensaje) {
      showOptions.message = mensaje;
    }
    
    // Agregar cancelable si se especifica (solo Android/Web desde v8.1.0)
    if (cancelable) {
      showOptions.cancelable = cancelable;
    }
    
    try {
      const result = await ActionSheet.showActions(showOptions);
      
      // Determinar si se canceló
      // Si existe la propiedad 'canceled' (versión 8.1.0+), usarla
      if ('canceled' in result && result.canceled === true) {
        return -1;
      }
      
      // Si no, verificar por índice -1
      if (result.index === -1) {
        return -1;
      }
      
      return result.index;
      
    } catch (error) {
      console.error('Error al mostrar Action Sheet:', error);
      return -1;
    }
  }
  
  /**
   * Versión con objeto de opciones (para mayor flexibilidad)
   */
  static async showWithOptions(
    opciones: ActionSheetOption[],
    titulo?: string,
    mensaje?: string,
    cancelable: boolean = false
  ): Promise<number> {
    
    const showOptions: {
      title?: string;
      message?: string;
      options: ActionSheetOption[];
      cancelable?: boolean;
    } = {
      options: opciones
    };
    
    if (titulo) showOptions.title = titulo;
    if (mensaje) showOptions.message = mensaje;
    if (cancelable) showOptions.cancelable = cancelable;
    
    try {
      const result = await ActionSheet.showActions(showOptions);
      
      if ('canceled' in result && result.canceled === true) {
        return -1;
      }
      
      return result.index === -1 ? -1 : result.index;
      
    } catch (error) {
      console.error('Error al mostrar Action Sheet:', error);
      return -1;
    }
  }
}