import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

interface AuthResponse {
  user: string;
  roles: string[];
  id: string;
  expires_in: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  private user: string | null = null;
  private roles: string[] = [];

  // ------------------- AUTH -------------------

  login(userName: string, password: string): Observable<AuthResponse> {
    const body = { userName, password };

    this.clearSession();

    return this.revokeAll().pipe(   // 👈 primero invalida sesiones
      tap(() => console.log('🧹 Sesiones previas eliminadas')),
      
      // luego login
      switchMap(() =>
        this.http.post<any>(`${this.baseUrl}/auth/login`, body, {
          withCredentials: true
        })
      ),

      tap(response => {
        this.setUser(response.user);
        this.setRoles(response.roles);

        const expiresAt = Date.now() + (response.expires_in * 60 * 1000);
        localStorage.setItem('sessionExpires', expiresAt.toString());

        console.log('✅ Login limpio y seguro');
      })
    );
  }

  isSessionExpired(): boolean {
    const expires = localStorage.getItem('sessionExpires');

    if (!expires) return true;

    return Date.now() > Number(expires);
  }

  revoke(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/revoke`, {}, {
      withCredentials: true
    });
  }

  revokeAll(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/revoke-all`, {}, {
      withCredentials: true
    });
  }

  clearSession() {
    this.user = null;
    this.roles = [];

    localStorage.clear();
    sessionStorage.clear();
  }

  logout(): Observable<any> {
    return this.revoke().pipe(  // 👈 invalida sesión actual
      tap(() => {
        console.log('🚪 Sesión revocada en backend');
        this.clearSession();
      })
    );
  }

  setRoles(roles: string[]) {
    this.roles = [...roles];
    localStorage.setItem('jwtRoles', JSON.stringify(this.roles));
  }

  getRoles(): string[] {
    if (this.roles.length === 0) {
      const rawRoles = localStorage.getItem('jwtRoles');
      if (!rawRoles) {
        return [];
      }

      try {
        const parsedRoles = JSON.parse(rawRoles);
        this.roles = Array.isArray(parsedRoles)
          ? parsedRoles.filter((role): role is string => typeof role === 'string')
          : [];
      } catch {
        this.roles = [];
      }
    }

    return [...this.roles];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return userRoles.some((role) => roles.includes(role));
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

  checkAuth(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/auth/check`, {
      withCredentials: true
    });
  }

  isLoggedIn(): boolean {
    const user = this.getUser();
    const roles = this.getRoles();

    if (!user || roles.length === 0) return false;

    if (this.isSessionExpired()) {
      this.clearSession();
      return false;
    }

    return true;
  }
}