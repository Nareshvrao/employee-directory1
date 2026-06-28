import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../service/employee/employee.service';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {
  signal,
  computed,
  effect
} from '@angular/core';
import { EmployeeCard } from '../employee-card/employee-card';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../service/auth/auth.service';
import {
  handleApiState
} from '../../operators/api-state.operator';
import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  ViewContainerRef
} from '@angular/core';

import {
  SuccessMessage
} from '../success-message/success-message';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmployeeCard]
})

export class Employees {

  loading = signal(false);
  errorMessage = signal('');
  employees$!: any;
  employeeForm = new FormGroup({
  name: new FormControl('', Validators.required),
  role: new FormControl('', Validators.required)
  });
  searchText = '';
  searchSubject = new Subject<string>();
  allEmployees: any[] = [];
  editId: string | null = null;

  @ViewChild('topSection')
  topSection!: ElementRef;

  @ViewChild(EmployeeCard)
  card!: EmployeeCard;

  @ViewChild(
  'messageContainer',
  { read: ViewContainerRef }
)
container!: ViewContainerRef;

  constructor(private service: EmployeeService,private authService: AuthService,
  private route: ActivatedRoute,
  private router: Router) {

  this.loadEmployees();

  this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(value => {

      this.filterEmployees(value);

    });

  this.route.data
  .subscribe(data => {

    const employee = data['employee'];

    this.editId = employee.id;

    this.employeeForm.patchValue({

      name: employee.name,

      role: employee.role

    });

  });

  /* this.route.params
  .pipe(

    switchMap(params => {

      const id = params['id'];

      if (!id) {
        return EMPTY;
      }

      this.loading.set(true);

      this.errorMessage.set('');

      return this.service.getEmployeeById(id);

    })

  )
  .subscribe({

    next: (employee: any) => {

      if (!employee) return;

      this.editId = employee.id;

      this.employeeForm.patchValue({
        name: employee.name,
        role: employee.role
      });

      this.loading.set(false);
    },

    error: (error) => {

      console.error(error);

      this.errorMessage.set('Failed to load employee before editing');

      this.loading.set(false);
    }

  }); */
}

scrollTop() {

  this.topSection
    .nativeElement
    .scrollIntoView();

}

Login() {
  this.router.navigate(['/login']);
}

Logout() {
  this.authService.clear();
}

showSuccess() {

  this.container.clear();

  this.container.createComponent(
    SuccessMessage
  );

}

loadEmployees() {

  this.loading.set(true);

  this.errorMessage.set('');

  this.employees$ = this.service.getEmployees()
    .pipe(

      map((employees: any[]) =>

        [...employees].reverse()

      ),
      handleApiState(
      this.loading,
      this.errorMessage
    )
    );
}

  addOrUpdate() {

  if (this.employeeForm.invalid) {
    return;
  }

  const value = this.employeeForm.value;

  this.loading.set(true);

  this.errorMessage.set('');

  if (this.editId !== null) {


    this.service.updateEmployee(this.editId, value)
      .subscribe({

        next: () => {

          this.card.incrementEditCount();
          this.router.navigate(['']);

        },

        error: (error) => {

          console.error(error);

          this.errorMessage.set('Failed to update employee');

          this.loading.set(false);
        }

      });

  } else {

    this.service.addEmployee(value)
      .subscribe({

        next: () => {

          this.employeeForm.reset();

          this.loadEmployees();

          this.showSuccess();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage.set('Failed to add employee');

          this.loading.set(false);
        }

      });
  }
}

  goToEdit(id: string) {


  this.router.navigate(['/employees', id])
  .then(success => {

    if (success) {

      this.errorMessage.set('');

    } else {

      this.errorMessage.set('Login before editing employee');

    }

  });

}

  delete(id: string) {

  this.loading.set(true);

  this.service.deleteEmployee(id)
    .subscribe({

      next: () => {
        this.loadEmployees();
      },

      error: () => {
        this.errorMessage.set('Failed to delete employee');
        this.loading.set(false);
      }

    });
}

onSearch(event: Event) {

  const value = (event.target as HTMLInputElement).value;

  this.searchSubject.next(value);
}

filterEmployees(value: string) {

  this.employees$ = this.service.getEmployees()
    .pipe(

      map((employees: any[]) =>

        [...employees
        .filter(emp =>

          emp.name.toLowerCase().includes(value.toLowerCase()) ||

          emp.role.toLowerCase().includes(value.toLowerCase())

        )]
          .reverse()

      )

    );
}
}
