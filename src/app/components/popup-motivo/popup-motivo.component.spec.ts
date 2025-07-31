import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMotivoComponent } from './popup-motivo.component';

describe('PopupMotivoComponent', () => {
  let component: PopupMotivoComponent;
  let fixture: ComponentFixture<PopupMotivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupMotivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
