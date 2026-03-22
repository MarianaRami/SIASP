import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-superior',
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './menu-superior.component.html',
  styleUrl: './menu-superior.component.css'
})
export class MenuSuperiorComponent {

  constructor(private authService: AuthService, private router: Router) {}

  get user(): string | null {
    return this.authService.getUser();
  }

  showLogoutMenu = false;

  toggleLogoutMenu() {
    this.showLogoutMenu = !this.showLogoutMenu;
  }

  logout(event: MouseEvent) {
    event.stopPropagation(); // evita que se cierre de inmediato
    this.showLogoutMenu = false;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        // aunque falle el revoke en backend, limpiar sesión local y redirigir
        this.authService.clearSession();
        this.router.navigate(['/']);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.logout-container')) {
      this.showLogoutMenu = false;
    }
  }
}
