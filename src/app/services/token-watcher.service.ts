import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenWatcherService {

  private lastToken: string | null = null;

  constructor(private authService: AuthService) { }

  startWatching() {
    this.lastToken = this.authService.getToken();

    setInterval(() => {
      const currentToken = this.authService.getToken();

      if (this.lastToken && currentToken !== this.lastToken) {
        alert('Sesión inválida');
        this.authService.logout();
      }
      // Cada cuanto tiempo revisar el token
    }, 20000);
  }
}
