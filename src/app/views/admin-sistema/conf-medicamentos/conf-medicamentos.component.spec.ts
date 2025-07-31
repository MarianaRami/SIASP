import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfMedicamentosComponent } from './conf-medicamentos.component';

describe('ConfMedicamentosComponent', () => {
  let component: ConfMedicamentosComponent;
  let fixture: ComponentFixture<ConfMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfMedicamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
