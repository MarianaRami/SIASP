import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProtocolosService } from '../../../services/protocolos.service';

@Component({
  selector: 'app-popup-cambio-protocolo',
  imports: [CommonModule, FormsModule],
  templateUrl: './popup-cambio-protocolo.component.html',
  styleUrl: './popup-cambio-protocolo.component.css'
})
export class PopupCambioProtocoloComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardarPaciente = new EventEmitter<any>();

  private protocolosService = inject(ProtocolosService);

  protocolos: any[] = [];
  tipos = [
    { label: 'Ambulatorio', value: 'ambulatorio' },
    { label: 'Hospitalizado', value: 'hospitalizado' }
  ];
  razones = [
    { label: 'Cambio de tratamiento', value: 'cambio_protocolo' },
    { label: 'Recaida', value: 'recaida' },
    { label: 'Transferencia', value: 'transferencia' }
  ];

  tratamientos = [
    { label: 'Mono', value: 'mono' },
    { label: 'Poli', value: 'poli' }
  ];

  tiposTratamiento = [
    { label: 'Alta', value: 'alta' },
    { label: 'Baja', value: 'baja' }
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
    this.cerrar.emit(); // cierra después de guardar (opcional)
  }

  seleccionarProtocolo(event: any) {
    const idSeleccionado = event.target.value;
    const protocolo = this.protocolos.find(p => p.id === idSeleccionado);

    if (protocolo) {
      this.formData.idProtocolo = protocolo.id;
      this.formData.protocolo = protocolo.nombre;
    }
  }

  cancelar() {
    this.cerrar.emit();
  }

  volver() {
    this.cerrar.emit();
  }

}
