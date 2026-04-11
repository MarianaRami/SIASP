import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.css']
})
export class TablaDinamicaComponent {
  @Input() columnas: any[] = [];
  @Input() datos: any[] = [];
  @Output() buscar = new EventEmitter<string>();
  @Output() cambio = new EventEmitter<any>();

  onEditar(fila: any) {
    console.log('Editar fila:', fila);
    this.buscar.emit(fila); 
  }

  onCambio(fila: any) {
    this.cambio.emit(fila);
  }

  mostrarCondicional(col: any, fila: any): boolean {
    if (!col.dependsOn) return false;
    const val = fila[col.dependsOn];
    return Array.isArray(col.dependsValue)
      ? col.dependsValue.includes(val)
      : val === col.dependsValue;
  }
}

