import { Component } from '@angular/core';
import { RouterOutlet, Router, provideRouter, RouterModule } from '@angular/router';
import { MenuSuperiorComponent } from './components/menu-superior/menu-superior.component';
import { MenuIzquierdoComponent } from './components/menu-izquierdo/menu-izquierdo.component';
import { NgIf } from '@angular/common';
import { routes } from './app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { GeneralFooterComponent } from './components/general-footer/general-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,  
    RouterModule,
    MenuIzquierdoComponent, MenuSuperiorComponent, 
    GeneralFooterComponent
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
