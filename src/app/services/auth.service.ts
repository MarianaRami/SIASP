import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private token: string | null = null;
  private user: string | null = null;

  private readonly http = inject(HttpClient);

  // ------------------- AUTH -------------------

  login(nombreUsuario: string): Observable<any> {
    const body = { nombreUsuario };
    return this.http.post(`${this.baseUrl}/auth/login`, body);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('jwtToken');
    }
    return this.token;
  }

  setUser(user: string) {
    this.user = user;
    localStorage.setItem('jwtUser', user);
  }

  getUser(): string | null {
    if (!this.user) {
      this.user = localStorage.getItem('jwtUser');
    }
    return this.user;
  }
}
