import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';

@Component({
  selector: 'app-historial-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-paciente.component.html',
  styleUrl: './historial-paciente.component.css'
})
export class HistorialPacienteComponent {

  constructor(private service: GestionPacientesService) {}

  documento: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  data: any[] = [];
  cargando = false;

  buscar() {
    if (!this.documento) {
      alert('Documento requerido');
      return;
    }

    if (!this.fechaInicio || !this.fechaFin) {
      alert('Fechas requeridas');
      return;
    }

    this.cargando = true;

    this.service
      .getAuditoriaPacienteGet(this.documento, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (res) => {
          this.data = res;
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
        }
      });
  }
}