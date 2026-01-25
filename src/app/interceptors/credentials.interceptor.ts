import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/*
// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonar request agregando withCredentials
  const clonedRequest = req.clone({
    withCredentials: true  // ⭐ Esto envía las cookies automáticamente
  });
  
  console.log('🚀 Request con cookies:', clonedRequest.url);
  
  return next(clonedRequest);
};
*/


export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Si la petición ya tiene withCredentials, no la modificamos
  const clonedRequest = req.clone({
    withCredentials: true
  });
  
  console.log('🔍 Petición con credenciales:', {
    url: clonedRequest.url,
    withCredentials: clonedRequest.withCredentials,
    method: clonedRequest.method,
    headers: clonedRequest.headers
  });
  
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('❌ Error 401 - No autorizado. La cookie podría no estar siendo enviada:', {
          url: error.url,
          status: error.status,
          message: error.message
        });
      }
      return throwError(() => error);
    })
  );
};