import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve roles array', () => {
    service.setRoles(['Admin', 'Enfermero']);

    expect(service.getRoles()).toEqual(['Admin', 'Enfermero']);
  });

  it('should validate hasRole and hasAnyRole', () => {
    service.setRoles(['Admin', 'Enfermero']);

    expect(service.hasRole('Admin')).toBeTrue();
    expect(service.hasRole('QF')).toBeFalse();
    expect(service.hasAnyRole(['QF', 'Admin'])).toBeTrue();
    expect(service.hasAnyRole(['QF', 'Farmacia'])).toBeFalse();
  });

  it('should return false from isLoggedIn when roles are empty', () => {
    service.setUser('usuario');
    localStorage.setItem('sessionExpires', (Date.now() + 60000).toString());

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return true from isLoggedIn when user, roles and expiration are valid', () => {
    service.setUser('usuario');
    service.setRoles(['Admin']);
    localStorage.setItem('sessionExpires', (Date.now() + 60000).toString());

    expect(service.isLoggedIn()).toBeTrue();
  });
});
