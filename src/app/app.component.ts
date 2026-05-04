import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MenuSuperiorComponent } from './components/menu-superior/menu-superior.component';
import { MenuIzquierdoComponent } from './components/menu-izquierdo/menu-izquierdo.component';
import { GeneralFooterComponent } from './components/general-footer/general-footer.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,  
    RouterModule,
    MenuIzquierdoComponent, MenuSuperiorComponent, 
    GeneralFooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, public authService: AuthService) {}

  get isLoginRoute(): boolean {
    return this.router.url === '/' || this.router.url === '/login';
  }

  ngOnInit() {
    if (this.authService.isSessionExpired()) {
      this.authService.clearSession();
    } else {
      // Sesión vigente: arrancar renovación automática y sync entre pestañas
      this.authService.startSessionManagement();
    }
  }

}
