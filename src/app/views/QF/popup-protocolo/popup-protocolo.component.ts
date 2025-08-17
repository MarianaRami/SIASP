import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProtocolosService } from '../../../services/protocolos.service';


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

  private protocolosService = inject(ProtocolosService);

  protocolos: string[] = [];
  tiposPaciente = ['Ambulatorio', 'Hospitalizado'];
  razones = ['Nuevo', 'Cambio de tratamiento'];

  fechaIngreso: string = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  formData = {
    protocolo: '',
    fechaConsulta: '',
    tipoPaciente: '',
    razon: '',
    fechaInicio: ''
  };

  ngOnInit() {
    this.protocolosService.getProtocolos().subscribe({
      next: (resp) => {
        this.protocolos = resp
          // filtrar solo protocolos activos 
          .filter((p: any) => p.estado === 'activo')
          // Extraer solo los nombres
          .map((p: any) => p.nombre);
        console.log('Protocolos cargados:', this.protocolos);
      },
      error: (err) => {
        console.error('Error cargando protocolos:', err);
      }
    });
  }

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