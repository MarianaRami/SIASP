import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuIzquierdoComponent } from './menu-izquierdo.component';

describe('MenuIzquierdoComponent', () => {

  let component: MenuIzquierdoComponent;
  let fixture: ComponentFixture<MenuIzquierdoComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole']);
    authServiceSpy.hasAnyRole.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [MenuIzquierdoComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuIzquierdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});