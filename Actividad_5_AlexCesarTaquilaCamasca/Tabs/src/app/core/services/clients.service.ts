import { Injectable } from '@angular/core';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  img: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  status: 'activo' | 'inactivo';
}

@Injectable({ providedIn: 'root' })
export class ClientsService {
  readonly clients: Client[] = [
    {
      id: 1,
      name: 'Ana López',
      email: 'ana.lopez@email.com',
      phone: '+34 600 123 456',
      img: 'https://randomuser.me/api/portraits/women/1.jpg',
      role: 'Frontend Developer',
      department: 'Ingenieria',
      location: 'Madrid, Espana',
      joinDate: 'Marzo 2021',
      status: 'activo',
    },
    {
      id: 2,
      name: 'Carlos Pérez',
      email: 'carlos.perez@email.com',
      phone: '+34 611 987 654',
      img: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: 'Product Manager',
      department: 'Producto',
      location: 'Barcelona, Espana',
      joinDate: 'Julio 2019',
      status: 'activo',
    },
    {
      id: 3,
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+34 622 456 789',
      img: 'https://randomuser.me/api/portraits/women/2.jpg',
      role: 'UX Designer',
      department: 'Diseno',
      location: 'Valencia, Espana',
      joinDate: 'Enero 2022',
      status: 'activo',
    },
    {
      id: 4,
      name: 'Luis Torres',
      email: 'luis.torres@email.com',
      phone: '+34 633 222 111',
      img: 'https://randomuser.me/api/portraits/men/2.jpg',
      role: 'Backend Developer',
      department: 'Ingenieria',
      location: 'Sevilla, Espana',
      joinDate: 'Octubre 2020',
      status: 'inactivo',
    },
    {
      id: 5,
      name: 'Sofía Ramírez',
      email: 'sofia.ramirez@email.com',
      phone: '+34 644 333 999',
      img: 'https://randomuser.me/api/portraits/women/3.jpg',
      role: 'DevOps Engineer',
      department: 'Infraestructura',
      location: 'Bilbao, Espana',
      joinDate: 'Junio 2023',
      status: 'activo',
    },
  ];

  getById(id: number): Client | undefined {
    return this.clients.find((c) => c.id === id);
  }
}
