import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:3000/users';

  private employeesSubject = new BehaviorSubject<any[]>([]);

  employees$ = this.employeesSubject.asObservable();

  // Inject HttpClient to make HTTP requests

  constructor(private http: HttpClient) {}

  getEmployeeById(id: string) {

    // Make an HTTP GET request to fetch employee data by ID

      return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getEmployees() {
    console.log("key");
    return this.http.get<any[]>(this.apiUrl)
      .pipe(

        tap(data => {
          console.log(data);
          this.employeesSubject.next(data);

        })

      );
  }

  addEmployee(emp: any) {
    return this.http.post(this.apiUrl, emp);
  }

  updateEmployee(id: string, emp: any) {
    return this.http.put(`${this.apiUrl}/${id}`, emp);
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
