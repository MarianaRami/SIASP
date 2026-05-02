import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-historial-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-paciente.component.html',
  styleUrl: './historial-paciente.component.css'
})
export class HistorialPacienteComponent {

  constructor(
    private service: GestionPacientesService, 
    private route: ActivatedRoute
  ) {}

  documento: string = '';
  fechaIni: string = '';
  fechaFin: string = '';

  historial: any[] = [];
  cargando = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.documento = params.get('cedula') || '';

      console.log('Documento desde URL:', this.documento);

      this.cargarHistorial();
    });
  }

  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private obtenerFechas(): { fechaIni: string; fechaFin: string } {
    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    return {
      fechaIni: this.fechaIni || this.formatearFecha(haceUnaSemana),
      fechaFin: this.fechaFin || this.formatearFecha(hoy)
    };
  }


  cargarHistorial() {
    const { fechaIni, fechaFin } = this.obtenerFechas();

    this.service.getAuditoriaPacienteGet(
      this.documento,
      fechaIni,
      fechaFin
    ).subscribe({
      next: (res) => {
        this.historial = res;
      },
      error: (err) => console.error(err)
    });
  }
}