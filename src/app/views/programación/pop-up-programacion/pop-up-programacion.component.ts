import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgramacionService } from '../../../services/programacion.service';

@Component({
  standalone: true,
  selector: 'app-pop-up-programacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up-programacion.component.html',
  styleUrl: './pop-up-programacion.component.css'
})
export class PopUpProgramacionComponent {
  @Input() modo: 'programar' | 'editar' = 'programar';
  @Input() tipoSilla: 'silla' | 'camilla' | 'habitacion' = 'silla';
  @Input() duracion: number = 0;
  @Output() cerrar = new EventEmitter<void>();
  @Output() programar = new EventEmitter<{ 
    aplicacion?: string;
    examenes?: string;
    laboratorios?: string;
    fechaEvento?: string;
    camilla?: boolean;
    idSilla?: string;
    horaInicio?: string;
    horaFin?: string;
    duracion?: number;
  }>();

  constructor(private programacionServicio: ProgramacionService) {}

  duracionStr = '';
  aplicacion = '';
  examenes = '';
  laboratorios = '';
  fechaEvento = '';

  // 🪑 Guardamos la silla seleccionada completa
  sillaSeleccionada: any = null;
  horaInicio: string | undefined;
  horaFin: string | undefined;
  camilla: boolean = false;

  sillasDisponibles: any[] = [];

  disponibilidadSalas:any = {};

  tipo = this.tipoSilla;

  crearTiempoDesdeMinutos(minutos: number): string {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

  ngOnInit() {
    this.duracionStr = this.crearTiempoDesdeMinutos(this.duracion);

    this.tipo = this.tipoSilla;
    this.cargarRecursos(this.tipo);
  }

  cargarDisponibilidad() {
    if (!this.fechaEvento || !this.duracion) return;

    this.programacionServicio
      .getDisponibilidadSillas(this.fechaEvento, this.duracion, this.tipo)
      .subscribe({
        next: (res) => {
          console.log('📊 Disponibilidad:', res);
          this.disponibilidadSalas = res.disponibilidadSalasObj || {};
        },
        error: (err) => console.error(err)
      });
  }

  onCambiosDisponibilidad() {
    this.cargarDisponibilidad();
  }

  seleccionarSilla(nombreSilla: string) {
    this.sillaSeleccionada = {
      id: nombreSilla, // ⚠️ ajusta si backend usa otro id
      nombre: nombreSilla
    };
  }

  cargarRecursos(tipo: 'silla' | 'camilla' | 'habitacion') {
    this.programacionServicio.getlistadoSillasDisponibles(tipo).subscribe({
      next: (res) => {
        console.log('✅ Recursos disponibles:', tipo, res);
        this.sillasDisponibles = res;
      },
      error: (err) => console.error('❌ Error:', err)
    });
  }

  onTipoCambio() {
    this.tipo = this.camilla ? 'camilla' : 'silla';

    this.sillaSeleccionada = null; // limpiar selección anterior
    this.cargarRecursos(this.tipo);
  }

  calcularDuracion(): void {
  if (!this.horaInicio || !this.horaFin) {
    this.duracion = 0;
    this.duracionStr = '';
    return;
  }

  const [hIni, mIni] = this.horaInicio.split(':').map(Number);
  const [hFin, mFin] = this.horaFin.split(':').map(Number);

  const inicioMin = hIni * 60 + mIni;
  const finMin = hFin * 60 + mFin;

  if (finMin <= inicioMin) {
    this.duracion = 0;
    this.duracionStr = '';
    return;
  }

  this.duracion = finMin - inicioMin;
  this.duracionStr = this.crearTiempoDesdeMinutos(this.duracion);
}


  volver() {
    this.cerrar.emit();
  }

  guardar() {
    if (this.modo === 'editar') {
      console.log('🪑 Silla seleccionada para programación:', this.sillaSeleccionada);
      this.programar.emit({
        fechaEvento: this.fechaEvento,
        idSilla: this.sillaSeleccionada?.id,
        horaInicio: this.horaInicio,
        horaFin: this.horaFin,
        duracion: this.duracion,
      });
    } else {
      this.programar.emit({
        aplicacion: this.aplicacion,
        examenes: this.examenes,
        laboratorios: this.laboratorios,
        camilla: this.camilla,
      });
    }
  }

  cancelar() {
    this.cerrar.emit();
  }
}

