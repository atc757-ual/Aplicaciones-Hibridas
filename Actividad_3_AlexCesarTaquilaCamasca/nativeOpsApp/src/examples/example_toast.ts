//import { ToastUtils } from '@core/utils/toast.utils';
import { ToastUtils } from '../core/utils/toast.utils';

export class MiComponente {
  // Hacer async el método
  async guardar() {
    // Simple
    await ToastUtils.show('Mensaje'); // Solo dentro de función async
    // Con parámetros específicos cuando los necesitas
    await ToastUtils.show('Error crítico', {
      duration: 'long',
      position: 'top',
    });
    await ToastUtils.show('Éxito', { duration: 'short', position: 'bottom' });
  }

  async ngOnInit() {
    // ✅ Válido porque ngOnInit puede ser async
    await ToastUtils.show('Componente cargado');
  }

  // Para métodos del template
  async onClick() {
    await ToastUtils.show('Click detectado');
  }
}
