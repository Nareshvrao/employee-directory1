import { Routes } from '@angular/router';
import { Employees } from './components/employees/employees';
import { Login } from './components/login/login';
import { About } from './components/about/about';
import { authGuard } from './auth-guard';
import {employeeResolver} from './resolvers/employee.resolver';
export const routes: Routes = [

  {
  path: 'login',
  component: Login
  },

  {
    path: '',
    loadComponent: () =>
    import('./components/employees/employees')
      .then(m => m.Employees)
  },

  {
  path: 'employees/:id',
  component: Employees,
  canActivate: [authGuard],
  data: {
    roles: ['admin']
    },

  resolve: {

    employee: employeeResolver

  }
  },
  {
    path: 'about',

    loadComponent: () =>
    import('./components/about/about')
      .then(m => m.About)

  }

];
