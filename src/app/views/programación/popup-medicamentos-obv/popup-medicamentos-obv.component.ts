import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup-medicamentos-obv',
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './popup-medicamentos-obv.component.html',
  styleUrl: './popup-medicamentos-obv.component.css'
})
export class PopupMedicamentosObvComponent {
 @Output() cerrar = new EventEmitter<void>();

  observaciones: string = '';

  medicamentos = [
    { medicamento: 'Paracetamol', presentacion: 'Tableta', dosis: '500mg', unidad: 'mg' },
    { medicamento: 'Ibuprofeno', presentacion: 'Jarabe', dosis: '200mg', unidad: 'ml' },
    { medicamento: 'Amoxicilina', presentacion: 'Cápsula', dosis: '250mg', unidad: 'mg' },
  ];

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    console.log('Observaciones:', this.observaciones);
    console.log('Medicamentos:', this.medicamentos);
    this.cerrar.emit(); // Cierra el popup
  }

  cancelar() {
    this.cerrar.emit(); 
  }
}
