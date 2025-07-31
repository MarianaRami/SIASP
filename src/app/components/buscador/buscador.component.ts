import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  imports: [FormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent {
  @Input() placeholder: string = 'Buscar...';
  @Output() buscar = new EventEmitter<string>();

  valorInput: string = '';

  onBuscar() {
   const cedula = this.valorInput.trim();
   if (cedula) {
      this.buscar.emit(cedula);  // Emitimos la cédula al padre
    }
  }
}
