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
  @Output() enviar = new EventEmitter<{motivo?:string; observaciones?: string}>();

  motivoSeleccionado: string = '';
  observaciones: string = '';

  motivos = [
    { value: 'no_finalizado', label: 'No finalizado'}, 
    { value: 'finalizado', label: 'Finalizado'}, 
    { value: 'cancelado', label: 'Cancelado'}, 
    { value: 'cambio_protocolo', label: 'Cambio de protocolo'}
  ]; 
  
  confirmar() {
    this.enviar.emit({
      motivo: this.motivoSeleccionado,
      observaciones: this.observaciones
    });
  }

  cancelar() {
    this.cerrar.emit(); 
  }
}

