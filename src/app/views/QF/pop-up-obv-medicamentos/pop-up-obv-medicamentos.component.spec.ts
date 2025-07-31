import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpObvMedicamentosComponent } from './pop-up-obv-medicamentos.component';

describe('PopUpObvMedicamentosComponent', () => {
  let component: PopUpObvMedicamentosComponent;
  let fixture: ComponentFixture<PopUpObvMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpObvMedicamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpObvMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
