import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectorFarmaciaComponent } from './director-farmacia.component';
import { GestionPacientesService } from '../../services/gestion-pacientes.service';
import { of } from 'rxjs';

describe('DirectorFarmaciaComponent', () => {
  let component: DirectorFarmaciaComponent;
  let fixture: ComponentFixture<DirectorFarmaciaComponent>;

  // 🔹 MOCK DEL SERVICIO
  const mockService = {
    getProyeccionMedicamentos: jasmine.createSpy().and.returnValue(of({ medicamentos: [] })),
    getProyeccionMedicamentosPorDia: jasmine.createSpy().and.returnValue(of({ reporte: [] }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorFarmaciaComponent],
      providers: [
        { provide: GestionPacientesService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorFarmaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not buscar if fechas are empty', () => {
    spyOn(window, 'alert');

    component.buscar();

    expect(window.alert).toHaveBeenCalled();
  });

  it('should call servicios on buscar', () => {
    component.fechaInicio = '2026-03-10';
    component.fechaFin = '2026-03-21';

    component.buscar();

    expect(mockService.getProyeccionMedicamentos).toHaveBeenCalled();
    expect(mockService.getProyeccionMedicamentosPorDia).toHaveBeenCalled();
  });
});