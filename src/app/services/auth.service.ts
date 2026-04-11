import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  user: string;
  roles: string[];
  id: string;
  expires_in: number;
  message?: string;
}

interface RefreshResponse {
  authenticated: boolean;
  roles?: string[];
  id?: string;
  expires_in?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private baseUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private user: string | null = null;
  private roles: string[] = [];

  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private storageListener: ((e: StorageEvent) => void) | null = null;

  // Cuántos ms antes de que expire el access token se lanza el refresh
  private readonly REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000;  // 2 minutos

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

        this.startSessionManagement();
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
    this.stopTimers();
    this.user = null;
    this.roles = [];

    localStorage.removeItem('jwtUser');
    localStorage.removeItem('jwtRoles');
    localStorage.removeItem('sessionExpires');
  }

  logout(): Observable<any> {
    this.stopTimers();
    return this.revoke().pipe(
      tap(() => {
        console.log('🚪 Sesión revocada en backend');
        this.clearSession();
      })
    );
  }

  // ------------------- SESSION REFRESH -------------------

  /**
   * Programa el refresh y activa la sincronización entre pestañas.
   * Llamar tras login o al arrancar la app con sesión vigente.
   */
  startSessionManagement(): void {
    this.scheduleRefresh();
    this.syncWithOtherTabs();
  }

  /**
   * Calcula cuánto tiempo falta hasta 2 min antes de que expire el
   * access token y programa un setTimeout preciso. Al completarse,
   * llama al servidor y se auto-reprograma con el nuevo expiry.
   */
  private scheduleRefresh(): void {
    this.stopRefreshTimer();

    const expires = Number(localStorage.getItem('sessionExpires'));
    const delay = Math.max(expires - Date.now() - this.REFRESH_BEFORE_EXPIRY_MS, 0);

    console.log(`⏱️ Próximo refresh en ${Math.round(delay / 1000)}s`);

    this.refreshTimer = setTimeout(() => this.doRefresh(), delay);
  }

  private doRefresh(): void {
    if (!this.getUser()) return;

    this.http.post<RefreshResponse>(`${this.baseUrl}/auth/refresh`, {}, { withCredentials: true })
      .subscribe({
        next: (res) => {
          if (!res.authenticated) {
            console.warn('⚠️ Refresh token inválido o expirado.');
            this.clearSession();
            this.router.navigate(['']);
            return;
          }
          const newExpiry = Date.now() + ((res.expires_in ?? 15) * 60 * 1000);
          localStorage.setItem('sessionExpires', newExpiry.toString());
          if (res.roles) {
            const newRoles = res.roles;
            if (JSON.stringify(newRoles) !== JSON.stringify(this.getRoles())) {
              this.setRoles(newRoles);
            }
          }
          console.log('🔄 Sesión renovada, expira en:', res.expires_in, 'min');
          // Auto-reprogramar para el siguiente ciclo
          this.scheduleRefresh();
        },
        error: () => {} // El interceptor maneja el 401
      });
  }

  // ------------------- CROSS-TAB SYNC -------------------

  private syncWithOtherTabs(): void {
    if (this.storageListener) return; // ya registrado

    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'sessionExpires' && event.newValue === null) {
        console.log('🔄 Logout detectado en otra pestaña.');
        this.stopTimers();
        this.clearSession();
        this.router.navigate(['']);
      }
      if (event.key === 'jwtRoles' && event.newValue && event.newValue !== event.oldValue) {
        try {
          this.roles = JSON.parse(event.newValue);
        } catch { /* ignore */ }
      }
    };

    window.addEventListener('storage', this.storageListener);
  }

  // ------------------- CLEANUP -------------------

  private stopRefreshTimer(): void {
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  stopTimers(): void {
    this.stopRefreshTimer();
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTimers();
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

  checkAuth(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.baseUrl}/auth/refresh`, {}, {
      withCredentials: true
    });
  }

  isLoggedIn(): boolean {
    const user = this.getUser();
    const roles = this.getRoles();

    if (!user || roles.length === 0) return false;

    return !this.isSessionExpired();
  }
}