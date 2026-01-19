import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { credentialsInterceptor } from './app/interceptors/credentials.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), 
    provideHttpClient(
      withInterceptors([credentialsInterceptor])
    )
  ],
});
