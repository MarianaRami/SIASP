import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendientesNotificacionComponent } from './pendientes-notificacion.component';

describe('PendientesNotificacionComponent', () => {
  let component: PendientesNotificacionComponent;
  let fixture: ComponentFixture<PendientesNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendientesNotificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendientesNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
