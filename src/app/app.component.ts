import { Component } from '@angular/core';
import { RouterOutlet, Router, provideRouter, RouterModule } from '@angular/router';
import { MenuSuperiorComponent } from './components/menu-superior/menu-superior.component';
import { MenuIzquierdoComponent } from './components/menu-izquierdo/menu-izquierdo.component';
import { NgIf } from '@angular/common';
import { routes } from './app.routes';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,  
    RouterModule,
    MenuIzquierdoComponent, MenuSuperiorComponent, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) {}

  get isLoginRoute(): boolean {
    return this.router.url === '/' || this.router.url === '/login';
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
