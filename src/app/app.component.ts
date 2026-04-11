import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { RouterOutlet, Router, provideRouter, RouterModule } from '@angular/router';
import { MenuSuperiorComponent } from './components/menu-superior/menu-superior.component';
import { MenuIzquierdoComponent } from './components/menu-izquierdo/menu-izquierdo.component';
import { NgIf } from '@angular/common';
import { routes } from './app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { GeneralFooterComponent } from './components/general-footer/general-footer.component';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
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

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    )
  ],
});


