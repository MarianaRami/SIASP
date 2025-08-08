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
    CommonModule, FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  loginError = false;
  loginResponse: any;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username).subscribe({
      next: (res) => {
        this.loginResponse = res;
        this.loginError = false;
        console.log('Login exitoso:', res);
        this.authService.setToken(res.access_token); //Guarda el token
        this.authService.setUser(this.username); //Guarda el usuario
        // Puedes redirigir aquí si quieres
        this.router.navigate(['admin-sistema']); 
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loginError = true;
      }
    });
  }
}

