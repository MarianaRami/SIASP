import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioPacientesComponent } from './calendario-pacientes.component';

describe('CalendarioPacientesComponent', () => {
  let component: CalendarioPacientesComponent;
  let fixture: ComponentFixture<CalendarioPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
