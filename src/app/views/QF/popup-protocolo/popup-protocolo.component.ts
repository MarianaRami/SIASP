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

  // Guardar objetos completos
  protocolos: any[] = [];
  tiposPaciente = ['Ambulatorio', 'Hospitalizado'];
  razones = ['Nuevo', 'Cambio de tratamiento'];

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
    fechaInicio: ''
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
    console.log('Datos guardados:', this.formData);
    this.guardarPaciente.emit(this.formData);
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
