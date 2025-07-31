import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCambioProtocoloComponent } from './popup-cambio-protocolo.component';

describe('PopupCambioProtocoloComponent', () => {
  let component: PopupCambioProtocoloComponent;
  let fixture: ComponentFixture<PopupCambioProtocoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupCambioProtocoloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCambioProtocoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
