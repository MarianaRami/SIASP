import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgramacionService } from '../../../services/programacion.service';

type TipoRecurso = 'silla' | 'camilla' | 'habitacion';

interface ProgramacionPopupPayload {
  aplicacion?: string;
  examenes?: string;
  laboratorios?: string;
  fechaEvento?: string;
  camilla?: boolean;
  idSilla?: string;
  horaInicio?: string;
  horaFin?: string;
  duracion?: number;
}

interface RecursoSeleccionado {
  id: string;
  nombre: string;
}

@Component({
  standalone: true,
  selector: 'app-pop-up-programacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up-programacion.component.html',
  styleUrl: './pop-up-programacion.component.css'
})
export class PopUpProgramacionComponent implements OnInit {
  @Input() modo: 'programar' | 'editar' = 'programar';
  @Input() tipoSilla: TipoRecurso = 'silla';
  @Input() duracion: number = 0;
  @Input() necesitaCamilla: boolean = false;
  @Input() requiereAsignacionRecurso = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() programar = new EventEmitter<ProgramacionPopupPayload>();

  constructor(private programacionServicio: ProgramacionService) {}

  duracionStr = '';
  aplicacion = '';
  examenes = '';
  laboratorios = '';
  fechaEvento = '';

  sillaSeleccionada: RecursoSeleccionado | null = null;
  horaInicio: string | undefined;
  horaFin: string | undefined;
  camilla = false;

  franjasDisponibles: any[] = [];
  habitaciones: any[] = [];
  cargandoHabitaciones = false;

  tipo: TipoRecurso = 'silla';

  mostrarDisponibilidad = false;
  cargandoDisponibilidad = false;
  sinDisponibilidad = false;

  crearTiempoDesdeMinutos(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  ngOnInit() {
    this.duracionStr = this.duracion ? this.crearTiempoDesdeMinutos(this.duracion) : '';
    this.camilla = this.necesitaCamilla;
    this.tipo = this.camilla ? 'camilla' : this.tipoSilla;

    if (this.requiereAsignacionRecurso && this.tipo === 'habitacion') {
      this.cargarHabitaciones();
    }
  }

  onFechaCambio() {
    this.onCambiosDisponibilidad();
  }

  onCambiosDisponibilidad() {
    this.mostrarDisponibilidad = false;
    this.cargandoDisponibilidad = false;
    this.sinDisponibilidad = false;
    this.franjasDisponibles = [];
    this.sillaSeleccionada = null;
    this.horaInicio = undefined;
    this.horaFin = undefined;
  }

  private timeToMinutes(time: string): number {
    const [h, m] = (time || '00:00').split(':').map(Number);
    return h * 60 + m;
  }

  get franjasAgrupadasPorSala(): { sala: number; franjas: any[] }[] {
    const mapa = new Map<number, any[]>();
    for (const f of this.franjasDisponibles) {
      if (!mapa.has(f.sala)) mapa.set(f.sala, []);
      mapa.get(f.sala)!.push(f);
    }
    return Array.from(mapa.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([sala, franjas]) => ({ sala, franjas }));
  }

  verDisponibilidad() {
    if (!this.requiereAsignacionRecurso) {
      return;
    }

    if (!this.fechaEvento) {
      alert('Selecciona una fecha primero');
      return;
    }

    if (!this.duracion || this.duracion <= 0) {
      alert('La duración del evento no está definida. Selecciona hora de inicio y fin.');
      return;
    }

    this.cargandoDisponibilidad = true;
    this.sinDisponibilidad = false;
    this.mostrarDisponibilidad = true;
    this.franjasDisponibles = [];
    this.sillaSeleccionada = null;

    this.programacionServicio
      .getDisponibilidadSillas(this.fechaEvento, this.duracion, this.tipo)
      .subscribe({
        next: (res) => {
          this.franjasDisponibles = res.franjas || [];
          this.sinDisponibilidad = this.franjasDisponibles.length === 0;
          this.cargandoDisponibilidad = false;
          this.mostrarDisponibilidad = true;
        },
        error: (err) => {
          console.error(err);
          this.cargandoDisponibilidad = false;
          this.mostrarDisponibilidad = false;
          alert('No fue posible consultar la disponibilidad.');
        }
      });
  }

  seleccionarFranja(franja: any) {
    this.sillaSeleccionada = { id: franja.idSilla, nombre: franja.nombreSilla };
    this.horaInicio = franja.horaInicioFranja;
    const finMin = this.timeToMinutes(franja.horaInicioFranja) + this.duracion;
    this.horaFin = this.crearTiempoDesdeMinutos(finMin);
    this.duracionStr = this.crearTiempoDesdeMinutos(this.duracion);
  }

  onHoraInicioCambio() {
    if (this.horaInicio && this.duracion > 0) {
      const finMin = this.timeToMinutes(this.horaInicio) + this.duracion;
      this.horaFin = this.crearTiempoDesdeMinutos(finMin);
    } else {
      this.horaFin = undefined;
    }
    this.sillaSeleccionada = null;
  }

  seleccionarHabitacion(hab: any) {
    this.sillaSeleccionada = { id: hab.id, nombre: hab.nombre };
  }

  cargarHabitaciones() {
    this.cargandoHabitaciones = true;
    this.programacionServicio.getlistadoSillasDisponibles('habitacion').subscribe({
      next: (res) => {
        this.habitaciones = res || [];
        this.cargandoHabitaciones = false;
      },
      error: (err) => {
        console.error(err);
        this.cargandoHabitaciones = false;
      }
    });
  }

  onTipoCambio() {
    this.tipo = this.camilla ? 'camilla' : this.tipoSilla;
    this.onCambiosDisponibilidad();
  }

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    if (this.modo === 'editar') {
      if (!this.fechaEvento) {
        alert('Selecciona la fecha del evento');
        return;
      }

      const payload: ProgramacionPopupPayload = {
        fechaEvento: this.fechaEvento
      };

      if (this.requiereAsignacionRecurso) {
        if (this.tipo !== 'habitacion' && (!this.horaInicio || !this.duracion)) {
          alert('Ingresa una hora de inicio válida');
          return;
        }

        if (!this.sillaSeleccionada?.id) {
          alert('Selecciona un recurso disponible antes de guardar');
          return;
        }

        payload.idSilla = this.sillaSeleccionada.id;
        if (this.tipo !== 'habitacion') {
          payload.horaInicio = this.horaInicio;
          payload.horaFin = this.horaFin;
          payload.duracion = this.duracion;
        }
      }

      this.programar.emit(payload);
      return;
    }

    this.programar.emit({
      aplicacion: this.aplicacion,
      examenes: this.examenes,
      laboratorios: this.laboratorios,
      camilla: this.camilla,
    });
  }

  cancelar() {
    this.cerrar.emit();
  }
}
