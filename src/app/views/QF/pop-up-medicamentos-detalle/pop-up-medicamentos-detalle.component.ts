import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-medicamentos-detalle',
  imports: [FormsModule, CommonModule],
  templateUrl: './pop-up-medicamentos-detalle.component.html',
  styleUrl: './pop-up-medicamentos-detalle.component.css'
})
export class PopUpMedicamentosDetalleComponent {
  @Output() cerrar = new EventEmitter<void>();

  medicamentos: any[] = [
    { medicamento: '', presentacion: '', cantidad: '' }
  ];

  agregarFila() {
    this.medicamentos.push({ medicamento: '', presentacion: '', cantidad: '' });
  }

  eliminarFila(index: number) {
    this.medicamentos.splice(index, 1);
  }

  guardar() {
    console.log('Datos guardados:', this.medicamentos);
    // Aquí podrías emitir un evento o cerrar el popup
    this.cerrar.emit();
  }
}
