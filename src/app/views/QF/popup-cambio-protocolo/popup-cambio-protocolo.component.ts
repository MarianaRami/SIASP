import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup-cambio-protocolo',
  imports: [CommonModule, FormsModule],
  templateUrl: './popup-cambio-protocolo.component.html',
  styleUrl: './popup-cambio-protocolo.component.css'
})
export class PopupCambioProtocoloComponent {
  @Output() cerrar = new EventEmitter<void>();

  protocolos = ['Protocolo A', 'Protocolo B', 'Protocolo C'];
  tipos = ['Ambulatorio', 'Hospitalizado']

  guardar() {
    console.log('Guardado');
    this.cerrar.emit(); // cierra después de guardar (opcional)
  }

  cancelar() {
    this.cerrar.emit();
  }

  volver() {
    this.cerrar.emit();
  }

}
