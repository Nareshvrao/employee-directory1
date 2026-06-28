import { inject } from '@angular/core';
import {
  ResolveFn
} from '@angular/router';

import {
  EmployeeService
} from '../service/employee/employee.service';

export const employeeResolver: ResolveFn<any> = (

  route

) => {

  const service =
    inject(EmployeeService);

  const id =
    route.params['id'];

  return service.getEmployeeById(id);

};
