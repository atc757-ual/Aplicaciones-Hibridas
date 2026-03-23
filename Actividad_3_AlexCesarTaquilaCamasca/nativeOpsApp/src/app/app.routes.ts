import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'incidente-create',
    loadComponent: () => import('./incidente/create/incidentecreate.page').then( m => m.IncidentecreatePage)
  },
  {
    path: 'incidente-detail',
    loadComponent: () => import('./incidente/detail/incidentedetail.page').then( m => m.IncidentedetailPage)
  },
];
