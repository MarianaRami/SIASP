import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCalendarioComponent } from './reporte-calendario.component';

describe('ReporteCalendarioComponent', () => {
  let component: ReporteCalendarioComponent;
  let fixture: ComponentFixture<ReporteCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
