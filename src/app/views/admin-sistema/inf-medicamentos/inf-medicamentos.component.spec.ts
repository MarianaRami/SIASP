import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfMedicamentosComponent } from './inf-medicamentos.component';

describe('InfMedicamentosComponent', () => {
  let component: InfMedicamentosComponent;
  let fixture: ComponentFixture<InfMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfMedicamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
