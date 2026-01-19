import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  private user: string | null = null;

  // ------------------- AUTH -------------------

  login(nombreUsuario: string): Observable<any> {
    const body = { nombreUsuario };
    // La cookie se establecerá automáticamente desde el backend
    return this.http.post(`${this.baseUrl}/auth/login`, body, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    // Endpoint para limpiar la cookie del lado del servidor
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true
    });
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

  // Método para verificar si el usuario está autenticado
  checkAuth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/check`, {
      withCredentials: true
    });
  }
}
