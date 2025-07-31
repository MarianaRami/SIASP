import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupProtocoloComponent } from './popup-protocolo.component';

describe('PopupProtocoloComponent', () => {
  let component: PopupProtocoloComponent;
  let fixture: ComponentFixture<PopupProtocoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupProtocoloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupProtocoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
