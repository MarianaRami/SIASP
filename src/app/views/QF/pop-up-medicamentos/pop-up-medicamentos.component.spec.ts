import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMedicamentosComponent } from './pop-up-medicamentos.component';

describe('PopUpMedicamentosComponent', () => {
  let component: PopUpMedicamentosComponent;
  let fixture: ComponentFixture<PopUpMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpMedicamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
