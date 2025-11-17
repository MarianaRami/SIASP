import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JefeEnfermeriaComponent } from './jefe-enfermeria.component';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('JefeEnfermeriaComponent', () => {
  let component: JefeEnfermeriaComponent;
  let fixture: ComponentFixture<JefeEnfermeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        JefeEnfermeriaComponent,   // 👉 standalone component
        TablaDinamicaComponent,    // 👉 tabla dinámica
        FormsModule,               // 👉 para ngModel
        CommonModule               // 👉 utilidades comunes
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefeEnfermeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔥 necesario para que corra el ciclo de Angular
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
