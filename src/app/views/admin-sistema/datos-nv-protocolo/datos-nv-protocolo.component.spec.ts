import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosNvProtocoloComponent } from './datos-nv-protocolo.component';

describe('DatosNvProtocoloComponent', () => {
  let component: DatosNvProtocoloComponent;
  let fixture: ComponentFixture<DatosNvProtocoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosNvProtocoloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosNvProtocoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
