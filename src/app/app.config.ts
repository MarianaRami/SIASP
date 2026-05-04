import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'America/Bogota' } }
  ],
};

/*
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])  // ⭐ Registrar interceptor
    ),
    // ... otros providers
  ]
};
*/