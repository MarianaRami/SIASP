import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-medicamentos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up-medicamentos.component.html',
  styleUrl: './pop-up-medicamentos.component.css'
})
export class PopUpMedicamentosComponent {
  @Output() cerrar = new EventEmitter<void>();

  medicamentos: any[] = [
    { medicamento: '', presentacion: '', dosis_calculada: '', dosis_formulada: '', icono: '' , unidad: '', cantidad: '' }
  ];

  agregarFila() {
    this.medicamentos.push({ medicamento: '', presentacion: '', dosis_calculada: '', dosis_formulada: '', icono: '', unidad: '', cantidad: '' });
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
