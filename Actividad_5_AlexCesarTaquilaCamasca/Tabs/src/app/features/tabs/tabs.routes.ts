import { Routes } from '@angular/router';
import { Tabs } from './tabs';

export const routes: Routes = [
  {
    path: '',
    component: Tabs,
    children: [
      {
        path: 'reservations/new',
        loadComponent: () =>
          import('../reservations/create-reservation.page').then((m) => m.CreateReservationPage),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('../clients/clients.page').then((m) => m.ClientsPage),
      },
      {
        path: 'clients/:id',
        loadComponent: () =>
          import('../clients/client-detail.page').then((m) => m.ClientDetailPage),
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('../reservations/reservations.page').then((m) => m.ReservationsPage),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../products/products.page').then((m) => m.ProductsPage),
      },
      {
        path: '',
        redirectTo: '/reservations',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/reservations',
    pathMatch: 'full',
  },
];
