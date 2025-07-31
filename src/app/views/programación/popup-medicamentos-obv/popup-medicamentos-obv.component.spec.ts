import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMedicamentosObvComponent } from './popup-medicamentos-obv.component';

describe('PopupMedicamentosObvComponent', () => {
  let component: PopupMedicamentosObvComponent;
  let fixture: ComponentFixture<PopupMedicamentosObvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupMedicamentosObvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMedicamentosObvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
