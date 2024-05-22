import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () =>
      import('./modules/landing/landing.component').then(
        (x) => x.LandingComponent
      ),
  },
  {
    path: 'wheater/:id/:lat/:lng',
    loadComponent: () =>
      import('./modules/wheater/wheater.component').then(
        (x) => x.WheaterComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
];
