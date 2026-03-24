import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraPhoto } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
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
}
