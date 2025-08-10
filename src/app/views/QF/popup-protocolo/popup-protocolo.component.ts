import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-popup-protocolo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup-protocolo.component.html',
  styleUrls: ['./popup-protocolo.component.css']
})
export class PopupProtocoloComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardarPaciente = new EventEmitter<any>();

  protocolos = ['Protocolo A', 'Protocolo B'];
  tiposPaciente = ['Ambulatorio', 'Hospitalizado'];
  razones = ['Nuevo', 'Cambio de tratamiento'];

  fechaIngreso = '07/06/2025' ;

  formData = {
    protocolo: '',
    fechaConsulta: '',
    tipoPaciente: '',
    razon: '',
    fechaInicio: ''
  };

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    console.log('Datos guardados:', this.formData);
    this.guardarPaciente.emit(this.formData);
    this.cerrar.emit();
  }

  esNuevo(): boolean {
    return this.formData.razon === 'Nuevo';
  }
}

