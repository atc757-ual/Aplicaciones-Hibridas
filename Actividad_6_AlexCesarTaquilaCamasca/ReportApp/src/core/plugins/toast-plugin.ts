import { Toast } from '@capacitor/toast';


export class ToastPlugin {

  static async show (message: string, options?: {
      duration?: 'short' | 'long';
      position?: 'top' | 'center' | 'bottom';
    }) {
      await Toast.show({
        text: message,
        duration: options?.duration ?? 'short',
        position: options?.position ?? 'bottom',
      });
    }

  // Método estático para mostrar un toast genérico solo con mensaje
  static async genericToast(message: string) {
    // Llama al método show con valores por defecto
    await this.show(message, { duration: 'long', position: 'top' });
  }
}