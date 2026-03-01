import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  private user: string | null = null;

  // ------------------- AUTH -------------------

  login(userName: string, password: string): Observable<any> {
    const body = { userName, password };
    console.log('📝 Intentando login con usuario:', userName);
    
    return this.http.post(`${this.baseUrl}/auth/login`, body, {
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('✅ Login exitoso, cookie debería estar guardada');
        if (this.user) {
          this.setUser(this.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.user = null;
        localStorage.removeItem('jwtUser');
        console.log('✅ Logout exitoso, cookie debería estar limpiada');
      })
    );
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

  checkAuth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/check`, {
      withCredentials: true
    });
  }
}