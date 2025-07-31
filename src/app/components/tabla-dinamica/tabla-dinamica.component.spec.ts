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

  onEditar(fila: any) {
    console.log('Editar fila:', fila);
    this.buscar.emit(fila); 
  }
}

