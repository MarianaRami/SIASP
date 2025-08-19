import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCicloComponent } from './configuracion-ciclo.component';

describe('ConfiguracionCicloComponent', () => {
  let component: ConfiguracionCicloComponent;
  let fixture: ComponentFixture<ConfiguracionCicloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionCicloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionCicloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
