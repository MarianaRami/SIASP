import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PopUpMedicamentosDetalleComponent } from './pop-up-medicamentos-detalle.component';

describe('PopUpMedicamentosDetalleComponent', () => {
  let component: PopUpMedicamentosDetalleComponent;
  let fixture: ComponentFixture<PopUpMedicamentosDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpMedicamentosDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpMedicamentosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
