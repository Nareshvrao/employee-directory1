import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

 private readonly TOKEN_KEY = 'token';
 private role = '';
  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getRole() {
  return this.role;
  }

  login(username: string, password: string) {

  if (
    username === 'admin' &&
    password === 'admin'
  ) {

    this.setToken('demo-token');

    this.role = 'admin';

    return true;
  }

  if (
    username === 'user' &&
    password === 'user'
  ) {

    this.setToken('demo-token');

    this.role = 'user';

    return true;
  }

  return false;
}
}
