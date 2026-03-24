import { DialogUtils } from '../core/utils/dialog.utils';
import { ToastUtils } from '../core/utils/toast.utils';


export class EjemploComponent {

  // Alert simple
  async mostrarError() {
    await DialogUtils.alert(
      'Ocurrió un error al guardar los datos',
      'Error',
      'Entendido'
    );
  }

  // Confirmación
  async eliminarElemento() {
    const confirmado = await DialogUtils.confirm(
      '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
      'Eliminar elemento',
      'Eliminar',
      'Cancelar'
    );
    
    if (confirmado) {
      await ToastUtils.show('Elemento eliminado correctamente');
    }
  }

  // Prompt con placeholder
  async pedirNombre() {
    const { value, cancelled } = await DialogUtils.prompt(
      'Por favor ingresa tu nombre para continuar',
      {
        title: 'Registro',
        okButtonTitle: 'Guardar',
        cancelButtonTitle: 'Saltar',
        inputPlaceholder: 'Escribe tu nombre aquí'
      }
    );
    
    if (!cancelled && value) {
      await ToastUtils.show(`¡Bienvenido ${value}!`);
    }
  }

  // Prompt con texto prepopulado
  async editarNombre() {
    const nombreActual = 'Juan Pérez';
    const { value, cancelled } = await DialogUtils.prompt(
      'Edita tu nombre',
      {
        title: 'Editar perfil',
        inputText: nombreActual,  // texto prepopulado
        okButtonTitle: 'Actualizar',
        cancelButtonTitle: 'Cancelar'
      }
    );
    
    if (!cancelled && value && value !== nombreActual) {
      await ToastUtils.show(`Nombre actualizado a: ${value}`);
    }
  }
}