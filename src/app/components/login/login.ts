import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {

  username = '';

  password = '';

  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    const success =
      this.authService.login(
        this.username,
        this.password
      );

    if (success) {

      this.router.navigate(['/']);

    } else {

      this.message =
        'Invalid credentials';

    }
  }
}
