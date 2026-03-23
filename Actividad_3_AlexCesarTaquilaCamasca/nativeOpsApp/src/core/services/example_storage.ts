import { storageService } from '../services/storage.service';

// Definir interfaces para tus datos
interface User {
  id: number;
  name: string;
  email?: string;
}

// En tu componente
const saveUser = async () => {
  const user: User = {
    id: 1,
    name: 'Max',
    email: 'max@example.com'
  };
  
  await storageService.setItem('user', user);
};

const loadUser = async () => {
  const user = await storageService.getItem<User>('user');
  if (user) {
    console.log(user.name); // Tipo seguro, con autocompletado
  }
};