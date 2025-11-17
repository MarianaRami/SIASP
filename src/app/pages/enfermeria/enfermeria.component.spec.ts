import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnfermeriaComponent } from './enfermeria.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';

describe('EnfermeriaComponent', () => {
  let component: EnfermeriaComponent;
  let fixture: ComponentFixture<EnfermeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EnfermeriaComponent,   // tu componente standalone
        FormsModule,           // necesario para [(ngModel)]
        CommonModule,          // necesario para *ngFor, *ngIf, etc.
        TablaDinamicaComponent // si el componente usa la tabla
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnfermeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
