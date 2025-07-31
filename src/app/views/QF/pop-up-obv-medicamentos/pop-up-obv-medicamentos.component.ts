import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-obv-medicamentos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up-obv-medicamentos.component.html',
  styleUrl: './pop-up-obv-medicamentos.component.css'
})
export class PopUpObvMedicamentosComponent{
  @Output() cerrar = new EventEmitter<void>();

  columnas = [
    { label: 'Medicamento', key: 'medicamento' },
    { label: 'Presentación', key: 'presentacion' },
    { label: 'Dosis', key: 'dosis' },
    { label: 'Frecuencia', key: 'frecuencia'}, //cantidad de días que va el medicamento en cada ciclo
    { label: 'Unidad', key: 'unidad' },
    { label: 'Cantidad', key: 'Cantidad'},
  
  ];

  datos: any[] = [
    { medicamento: 'Ibuprofeno', presentacion: '200mg', dosis: '1', unidad: 'Tableta' },
    { medicamento: 'Paracetamol', presentacion: '500mg', dosis: '1', unidad: 'Tableta' }
  ];

  agregarFila() {
    this.datos.push({ medicamento: '', presentacion: '', dosis: '', unidad: '' });

  }

  eliminarFila(index: number) {
    this.datos.splice(index, 1);
  }

  guardar() {
    console.log('Guardado exitoso:', this.datos);
    // Puedes cerrar el popup aquí si es necesario
    this.cerrar.emit();
  }
}

