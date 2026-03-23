// core/utils/dialog.utils.ts
import { Dialog } from '@capacitor/dialog';

export class DialogUtils {
  
  /**
   * Alerta simple con botón OK
   */
  static async alert(
    message: string,
    title?: string,
    buttonTitle?: string
  ): Promise<void> {
    await Dialog.alert({
      title: title ?? 'Aviso',
      message: message,
      buttonTitle: buttonTitle ?? 'OK'
    });
  }

  /**
   * Confirmación con opciones Aceptar/Cancelar
   * @returns true si presionó OK, false si Cancel
   */
  static async confirm(
    message: string,
    title?: string,
    okButtonTitle?: string,
    cancelButtonTitle?: string
  ): Promise<boolean> {
    const { value } = await Dialog.confirm({
      title: title ?? 'Confirmar',
      message: message,
      okButtonTitle: okButtonTitle ?? 'Aceptar',
      cancelButtonTitle: cancelButtonTitle ?? 'Cancelar'
    });
    return value;
  }

  /**
   * Prompt con entrada de texto
   * @returns objeto con el texto ingresado y si fue cancelado
   */
  static async prompt(
    message: string,
    options?: {
      title?: string;
      okButtonTitle?: string;
      cancelButtonTitle?: string;
      inputPlaceholder?: string;
      inputText?: string;  // texto prepopulado
    }
  ): Promise<{ value: string | null; cancelled: boolean }> {
    const result = await Dialog.prompt({
      title: options?.title ?? 'Entrada de texto',
      message: message,
      okButtonTitle: options?.okButtonTitle ?? 'Aceptar',
      cancelButtonTitle: options?.cancelButtonTitle ?? 'Cancelar',
      inputPlaceholder: options?.inputPlaceholder,
      inputText: options?.inputText
    });
    
    return {
      value: result.cancelled ? null : result.value,
      cancelled: result.cancelled
    };
  }
}