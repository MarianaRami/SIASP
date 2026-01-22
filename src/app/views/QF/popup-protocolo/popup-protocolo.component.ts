import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  protocolos: any[] = [];
  tiposPaciente = [{ label: 'Ambulatorio', value: 'ambulatorio' },{ label: 'Hospitalizado', value: 'hospitalizado' }];
  razones = [
    { label: 'Nuevo', value: 'nuevo' },
    { label: 'Cambio de tratamiento', value: 'cambio_protocolo' },
    { label: 'Recaida', value: 'recaida' },
    { label: 'Transferencia', value: 'transferencia' }
  ];

  tratamientos = [
    { label: 'Monoterapia', value: 'mono' },
    { label: 'Politerapia', value: 'poli' }
  ];

  tiposTratamiento = [
    { label: 'Alta toxicidad', value: 'alta' },
    { label: 'Baja toxicidad', value: 'baja' }
  ];

  fechaIngreso: string = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  formData = {
    idProtocolo: '',
    protocolo: '', 
    fechaConsulta: '',
    tipoPaciente: '',
    razon: '',
    fechaInicio: '',
    tratamiento: '',       
    tipoTratamiento: ''      
  };

  ngOnInit() {
    this.protocolosService.getProtocolos().subscribe({
      next: (resp) => {
        this.protocolos = resp.filter((p: any) => p.estado === 'activo');
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
    const payload = {
      ...this.formData,
      fechaConsulta: this.formData.fechaConsulta
        ? new Date(this.formData.fechaConsulta).toISOString()
        : null,
      fechaInicio: this.formData.fechaInicio
        ? new Date(this.formData.fechaInicio).toISOString()
        : null
    };

    console.log('Datos guardados:', payload);
    this.guardarPaciente.emit(payload);
    this.cerrar.emit();
  }

  esNuevo(): boolean {
    return this.formData.razon === 'Nuevo';
  }

  // Cuando cambia el select, actualizar nombre + id
  seleccionarProtocolo(event: any) {
    const idSeleccionado = event.target.value;
    const protocolo = this.protocolos.find(p => p.id === idSeleccionado);

    if (protocolo) {
      this.formData.idProtocolo = protocolo.id;
      this.formData.protocolo = protocolo.nombre;
    }
  }
}
