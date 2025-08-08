import { Component, HostListener, OnInit } from '@angular/core';
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
export class MenuSuperiorComponent implements OnInit {
  user: string | null = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  showLogoutMenu = false;

  toggleLogoutMenu() {
    this.showLogoutMenu = !this.showLogoutMenu;
  }

  logout(event: MouseEvent) {
    event.stopPropagation(); // evita que se cierre de inmediato
    // Aquí haces la navegación al login
    this.router.navigate(['/']);
    this.showLogoutMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.logout-container')) {
      this.showLogoutMenu = false;
    }
  }
}
