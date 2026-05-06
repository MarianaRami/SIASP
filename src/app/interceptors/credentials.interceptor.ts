import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('⚠️ Sesión expirada o inválida. Limpiando sesión y redirigiendo al login.', {
          url: error.url,
          status: error.status
        });
        authService.clearSession();
        router.navigate(['']);
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};