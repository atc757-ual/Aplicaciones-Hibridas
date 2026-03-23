// core/utils/toast.utils.ts
import { Toast } from '@capacitor/toast';


export class ToastUtils {
  static async show(
    message: string,
    options?: {
      duration?: 'short' | 'long';
      position?: 'top' | 'center' | 'bottom';
    }
  ) {
    await Toast.show({
      text: message,
      duration: options?.duration ?? 'long',
      position: options?.position ?? 'top'
    });
  }
}