import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';

  loginError = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  mostrarPassword = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  resetMensajes() {
    this.loginError = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {

    this.loading = true;
    this.loginError = false;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.username, this.password).subscribe({

      next: (res) => {
        console.log('Login exitoso:', res);

        this.successMessage = res.message || 'Login exitoso';
        this.loading = false;

        this.router.navigate(['inicio']);
      },

      error: (err) => {
        console.error('Error en login:', err);

        this.loading = false;
        this.loginError = true;

        if (err.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else if (err.status === 0) {
          this.errorMessage = 'No hay conexión con el servidor';
        } else {
          this.errorMessage = err?.error?.message || 'Error inesperado';
        }
      }

    });

  }
}