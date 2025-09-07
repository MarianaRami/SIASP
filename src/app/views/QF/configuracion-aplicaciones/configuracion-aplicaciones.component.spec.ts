import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionAplicacionesComponent } from './configuracion-aplicaciones.component';

describe('ConfiguracionAplicacionesComponent', () => {
  let component: ConfiguracionAplicacionesComponent;
  let fixture: ComponentFixture<ConfiguracionAplicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionAplicacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionAplicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
