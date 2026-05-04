import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-inicio',
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})

export class Inicio {
  usuario: string;

  constructor(private authService: AuthService) {
    this.usuario = this.authService.getUser() || 'Usuario';
  }
}
