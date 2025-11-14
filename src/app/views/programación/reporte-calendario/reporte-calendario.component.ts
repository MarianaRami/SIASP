import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramacionService } from '../../../services/programacion.service';

interface PacienteTurno {
  sala: number;
  posicion: string;
  horaInicio: string;
  duracion: number;
  nombre: string;
}

@Component({
  selector: 'app-reporte-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-calendario.component.html',
  styleUrls: ['./reporte-calendario.component.css']
})
export class ReporteCalendarioComponent {
  fechaSeleccionada: string = '';
  horas: string[] = [];
  salas: { id: number; posiciones: string[] }[] = [];
  pacientes: PacienteTurno[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private miServicio: ProgramacionService,
  ) { this.generarHoras(); }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.fechaSeleccionada = params.get('date') || '';
    });

    this.miServicio.getasignacionSillaPaciente(this.fechaSeleccionada).subscribe(resp => {
      console.log('respuesta asignacion sillas:', resp);

      const disponibilidad = resp.disponibilidadSalasObj || {};

      this.salas = [];
      this.pacientes = [];

      // Convertir las claves de salas en un arreglo
      for (let salaId of Object.keys(disponibilidad)) {

        const salaObj = disponibilidad[salaId];
        const posiciones = Object.keys(salaObj);

        // Guardar sala para la tabla
        this.salas.push({
          id: Number(salaId),
          posiciones: posiciones
        });

        // Procesar cada posición
        for (let pos of posiciones) {
          const eventos = salaObj[pos].eventosSilla || [];

          for (let evento of eventos) {

            // Convertir horaInicio → HH:mm
            const horaInicioHM = evento.horaInicio.substring(0, 5);

            // convertir duración en minutos a duración en horas (redondear hacia arriba)
            const duracionHoras = Math.ceil(evento.duracion / 60);

            this.pacientes.push({
              sala: Number(salaId),
              posicion: pos,
              horaInicio: horaInicioHM,
              duracion: duracionHoras,
              nombre: evento.nombre
            });
          }
        }
      }

      console.log("Pacientes transformados:", this.pacientes);
      console.log("Salas transformadas:", this.salas);
    });
  }

  volver() {
    this.router.navigate(['programacion/calendario']);
  }

  generarHoras() {
    this.horas = [];
    for (let h = 7; h <= 19; h++) {
      this.horas.push(`${h}:00`);
    }
  }

  getPacienteBloque(salaId: number, posicion: string, hora: string): PacienteTurno | null {
    const horaNum = parseInt(hora.split(':')[0]);
    const paciente = this.pacientes.find(p => {
      const inicio = parseInt(p.horaInicio.split(':')[0]);
      const fin = inicio + p.duracion;
      return p.sala === salaId && p.posicion === posicion && horaNum >= inicio && horaNum < fin;
    });

    if (!paciente) return null;

    // Mostrar solo en la hora de inicio
    const horaInicioNum = parseInt(paciente.horaInicio.split(':')[0]);
    return horaNum === horaInicioNum ? paciente : null;
  }

  calcularColspan(paciente: PacienteTurno): number {
    return paciente.duracion;
  }

  calcularHoraFin(paciente: PacienteTurno): string {
    const inicio = parseInt(paciente.horaInicio.split(':')[0]);
    const fin = inicio + paciente.duracion;
    return `${fin}:00`;
  }

  isHoraOcupada(salaId: number, posicion: string, hora: string): boolean {
    const horaNum = parseInt(hora.split(':')[0]);
    return this.pacientes.some(p => {
      const inicio = parseInt(p.horaInicio.split(':')[0]);
      const fin = inicio + p.duracion;
      return p.sala === salaId && p.posicion === posicion && horaNum > inicio && horaNum < fin;
    });
  }
}
