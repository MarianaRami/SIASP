import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorUsuariosComponent } from './administrador-usuarios.component';
import { GestionUsuariosService } from '../../services/gestion-usuarios';
import { of } from 'rxjs';

describe('AdministradorUsuariosComponent', () => {
  let component: AdministradorUsuariosComponent;
  let fixture: ComponentFixture<AdministradorUsuariosComponent>;
  let mockUsuariosService: any;

  beforeEach(async () => {

    // 🔥 mock del servicio
    mockUsuariosService = {
      getUsuarios: jasmine.createSpy().and.returnValue(of([])),
      cambiarEstadoUsuario: jasmine.createSpy().and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [AdministradorUsuariosComponent],
      providers: [
        { provide: GestionUsuariosService, useValue: mockUsuariosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministradorUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter users by name', () => {
    component.datos = [
      { Nombre: 'Juan', Cedula: '123' },
      { Nombre: 'Maria', Cedula: '456' }
    ];

    component.filtro = 'juan';
    component.filtrarDatos();

    expect(component.datosFiltrados.length).toBe(1);
  });

  it('should call cambiarEstadoUsuario on state change', () => {
    const fila = { id: '1', estado: 'activo' };

    component.onCambioEstado(fila);

    expect(mockUsuariosService.cambiarEstadoUsuario).toHaveBeenCalledWith('1', 'activo');
  });

});