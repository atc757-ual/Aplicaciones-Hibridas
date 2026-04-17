import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraPhoto } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CameraPlugin {
  /**
   * Toma una foto usando la cámara del dispositivo y retorna el objeto CameraPhoto
   */
  async takePhoto(): Promise<CameraPhoto | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      return image.webPath ? image : null;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }

  /**
   * Consulta si el permiso de cámara está concedido
   */
  async isCameraPermissionGranted(): Promise<boolean> {
    const cameraPerm = await Camera.checkPermissions();
    return cameraPerm.camera === 'granted';
  }

  /**
   * Solicita permiso de cámara al usuario
   */
  async requestCameraPermission(): Promise<boolean> {
    const cameraPerm = await Camera.requestPermissions({ permissions: ['camera'] });
    return cameraPerm.camera === 'granted';
  }

  /**
   * Intenta tomar foto con Capacitor Camera, y en web hace fallback a un input file.
   */
  async takePhotoWithFallback(): Promise<CameraPhoto | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      return image.webPath ? image : null;
    } catch (error) {
      console.warn('Camera.getPhoto falló, intentando fallback web:', error);
      // Fallback en web: usar input[type=file]
      try {
        if (Capacitor.getPlatform() === 'web') {
          return await new Promise<CameraPhoto | null>((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.addEventListener('change', async () => {
              const file = input.files && input.files[0];
              if (!file) {
                document.body.removeChild(input);
                resolve(null);
                return;
              }
              const url = URL.createObjectURL(file);
              const fakePhoto: any = { webPath: url } as CameraPhoto;
              document.body.removeChild(input);
              resolve(fakePhoto);
            });
            input.click();
          });
        }
      } catch (e) {
        console.warn('Fallback web de cámara falló:', e);
      }
      return null;
    }
  }
}
