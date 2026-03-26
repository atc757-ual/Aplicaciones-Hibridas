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
    path: 'report-create',
    loadComponent: () => import('./report/create/reportcreate.page').then( m => m.ReportcreatePage)
  },
  {
    path: 'report-list',
    loadComponent: () => import('./report/list/reportlist.page').then( m => m.ReportlistPage)
  },
];
