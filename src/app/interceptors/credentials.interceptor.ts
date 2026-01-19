import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Clona la petición y añade withCredentials: true
  const clonedRequest = req.clone({
    withCredentials: true
  });
  
  return next(clonedRequest);
};
