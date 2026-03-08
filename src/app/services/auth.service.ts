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
  private role: string | null = null;

  // ------------------- AUTH -------------------

  login(userName: string, password: string): Observable<any> {
    const body = { userName, password };

    return this.http.post<any>(`${this.baseUrl}/auth/login`, body, {
      withCredentials: true
    }).pipe(
      tap(response => {

        this.setUser(response.user);
        this.setRole(response.role);

        const expiresAt = Date.now() + (response.expires_in * 60 * 1000);

        localStorage.setItem('sessionExpires', expiresAt.toString());

      })
    );
  }

  isSessionExpired(): boolean {
    const expires = localStorage.getItem('sessionExpires');

    if (!expires) return true;

    return Date.now() > Number(expires);
  }

  clearSession() {
    this.user = null;
    this.role = null;

    localStorage.removeItem('jwtUser');
    localStorage.removeItem('jwtRole');
    localStorage.removeItem('sessionExpires');
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.user = null;
        this.clearSession();
        localStorage.removeItem('jwtUser');
        console.log('✅ Logout exitoso, cookie debería estar limpiada');
      })
    );
  }

  setRole(role: string) {
    this.role = role;
    localStorage.setItem('jwtRole', role);
  }

  getRole(): string | null {
    if (!this.role) {
      this.role = localStorage.getItem('jwtRole');
    }
    return this.role;
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.getRole();
    return !!userRole && roles.includes(userRole);
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

  isLoggedIn(): boolean {
    const user = this.getUser();
    const role = this.getRole();

    if (!user || !role) return false;

    if (this.isSessionExpired()) {
      this.clearSession();
      return false;
    }

    return true;
  }
}