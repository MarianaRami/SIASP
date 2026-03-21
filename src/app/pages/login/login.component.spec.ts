import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {

    const mockResponse = {
      user: 'yankvale',
      roles: ['admin', 'Enfermeria'],
      id: '123e4567-e89b-12d3-a456-426614174000',
      expires_in: 15,
      message: 'Login exitoso'
    };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.username = 'yankvale';
    component.password = '1234';

    component.onLogin();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.loginError).toBeFalse();

  });

});
