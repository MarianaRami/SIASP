import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup-motivo',
  templateUrl: './popup-motivo.component.html',
  styleUrls: ['./popup-motivo.component.css'],
  imports: [
    CommonModule, FormsModule
  ]
})
export class PopupMotivoComponent {
  @Output() cerrar = new EventEmitter<void>();

  motivoSeleccionado: string = '';
  observaciones: string = '';

  motivos = ['Error de carga', 'Cambio de paciente', 'Otro']; // Puedes cambiar estos motivos

  confirmar() {
    console.log('Motivo:', this.motivoSeleccionado);
    console.log('Observaciones:', this.observaciones);
    this.cerrar.emit(); // Cierra el popup
  }

  cancelar() {
    this.cerrar.emit(); // También cierra sin guardar
  }
}

