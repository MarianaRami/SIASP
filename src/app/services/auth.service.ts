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
    return this.http.post(`${this.baseUrl}/auth/login`, { nombreUsuario })
      .pipe(
        tap((res: any) => {
          if (res?.token) {
            this.setToken(res.token);
            this.setUser(nombreUsuario);
          }
        })
      );
  }

  // ---------------- TOKEN (COOKIES) ----------------

  setToken(token: string) {
    document.cookie = `jwtToken=${token}; path=/; SameSite=Lax`;
  }

  getToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )jwtToken=([^;]+)'));
    return match ? match[2] : null;
  }

  removeToken() {
    document.cookie = 'jwtToken=; Max-Age=0; path=/';
  }

  // ---------------- USER ----------------

  setUser(user: string) {
    localStorage.setItem('jwtUser', user);
  }

  getUser(): string | null {
    return localStorage.getItem('jwtUser');
  }

  logout() {
    this.removeToken();
    localStorage.removeItem('jwtUser');
    window.location.href = '/login';
  }
}
