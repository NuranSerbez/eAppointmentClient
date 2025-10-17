import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layouts } from './components/layouts/layouts';
import { Home } from './components/home/home';
import { NotFound } from './components/not-found/not-found';
import { Doctors } from './components/doctors/doctors';
import { inject } from '@angular/core';
import { Auth } from './services/auth';
import { Patients } from './components/patients/patients';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Layouts,
    canActivateChild: [() => inject(Auth).isAuthenticated()],
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'doctors',
        component: Doctors,
      },
      {
        path: 'patients',
        component: Patients,
      },
    ],
  },
  {
    path: '**', // NotFound için catch-all
    component: NotFound,
  },
];
