import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PopUpProgramacionComponent } from './pop-up-programacion.component';
import { ProgramacionService } from '../../../services/programacion.service';

describe('PopUpProgramacionComponent', () => {
  let component: PopUpProgramacionComponent;
  let fixture: ComponentFixture<PopUpProgramacionComponent>;
  let programacionServiceSpy: jasmine.SpyObj<ProgramacionService>;

  beforeEach(async () => {
    programacionServiceSpy = jasmine.createSpyObj<ProgramacionService>(
      'ProgramacionService',
      ['getDisponibilidadSillas', 'getasignacionSillaPaciente']
    );
    programacionServiceSpy.getDisponibilidadSillas.and.returnValue(of({ disponibilidadSalasObj: {} }));
    programacionServiceSpy.getasignacionSillaPaciente.and.returnValue(of({ disponibilidadSalasObj: {} }));

    await TestBed.configureTestingModule({
      imports: [PopUpProgramacionComponent],
      providers: [
        { provide: ProgramacionService, useValue: programacionServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpProgramacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate duration from start and end time', () => {
    component.horaInicio = '08:00';
    component.horaFin = '09:30';

    component.calcularDuracion();

    expect(component.duracion).toBe(90);
    expect(component.duracionStr).toBe('01:30');
  });

  it('should emit schedule data in edit mode when resource is required', () => {
    spyOn(component.programar, 'emit');
    component.modo = 'editar';
    component.requiereAsignacionRecurso = true;
    component.fechaEvento = '2026-05-05';
    component.horaInicio = '10:00';
    component.horaFin = '11:00';
    component.duracion = 60;
    component.sillaSeleccionada = { id: 'S1', nombre: 'S1' };

    component.guardar();

    expect(component.programar.emit).toHaveBeenCalledWith({
      fechaEvento: '2026-05-05',
      idSilla: 'S1',
      horaInicio: '10:00',
      horaFin: '11:00',
      duracion: 60
    });
  });

  it('should request availability and show returned rooms', () => {
    programacionServiceSpy.getasignacionSillaPaciente.and.returnValue(of({
      disponibilidadSalasObj: {
        A: {
          S1: { eventosSilla: [] }
        }
      }
    }));
    component.requiereAsignacionRecurso = true;
    component.fechaEvento = '2026-05-05';
    component.horaInicio = '08:00';
    component.horaFin = '09:00';

    component.verDisponibilidad();

    expect(programacionServiceSpy.getasignacionSillaPaciente).toHaveBeenCalledWith('2026-05-05');
    expect(component.mostrarDisponibilidad).toBeTrue();
    expect(component.sinDisponibilidad).toBeFalse();
    expect(component.disponibilidadSalas['A']['S1']).toEqual({ eventosSilla: [] });
  });

  it('should load daily availability when the date changes in edit mode', () => {
    component.modo = 'editar';
    component.requiereAsignacionRecurso = true;
    component.fechaEvento = '2026-05-06';

    component.onFechaCambio();

    expect(programacionServiceSpy.getasignacionSillaPaciente).toHaveBeenCalledWith('2026-05-06');
  });
});
