import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getRoles', 'hasAnyRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should deny when user has no roles', () => {
    authServiceSpy.getRoles.and.returnValue([]);

    const result = executeGuard({ data: { roles: ['Admin'] } } as any, {} as any);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });

  it('should allow when user has one allowed role', () => {
    authServiceSpy.getRoles.and.returnValue(['Enfermero', 'Admin']);
    authServiceSpy.hasAnyRole.and.returnValue(true);

    const result = executeGuard({ data: { roles: ['Admin'] } } as any, {} as any);

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny when user has none of the allowed roles', () => {
    authServiceSpy.getRoles.and.returnValue(['Enfermero']);
    authServiceSpy.hasAnyRole.and.returnValue(false);

    const result = executeGuard({ data: { roles: ['Admin', 'QF'] } } as any, {} as any);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });
});
