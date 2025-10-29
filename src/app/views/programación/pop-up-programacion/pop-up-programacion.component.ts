import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgramacionService } from '../../../services/programacion.service';

@Component({
  selector: 'app-pop-up-programacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up-programacion.component.html',
  styleUrl: './pop-up-programacion.component.css'
})
export class PopUpProgramacionComponent {
  @Input() modo: 'programar' | 'editar' = 'programar';
  @Output() cerrar = new EventEmitter<void>();
  @Output() programar = new EventEmitter<{ 
    aplicacion?: string; examenes?: string; laboratorios?: string; fechaEvento?: string; camilla?: boolean; idSilla?: string; horaInicio?: string; horaFin?: string; duracion?: number; 
  }>();

  constructor(
    private programacionServicio: ProgramacionService
  ) {}

  aplicacion = '';
  examenes = '';
  laboratorios = '';

  fechaEvento = '';

  idSilla: string | undefined;
  horaInicio: string | undefined;
  horaFin: string | undefined;
  duracion: number | undefined;

  camilla: boolean = false;

  sillasDisponibles: any[] = [];

  ngOnInit() {
    this.programacionServicio.getlistadoSillasDisponibles().subscribe({
      next: (res) => {
        console.log('✅ Listado de sillas:', res);
        this.sillasDisponibles = res;
      },
      error: (err) => console.error('❌ Error al obtener listado de sillas:', err)
    });
  }

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    if (this.modo === 'editar') {
      this.programar.emit({
        fechaEvento: this.fechaEvento,
        camilla: this.camilla,
        idSilla: this.idSilla,
        horaInicio: this.horaInicio,
        horaFin: this.horaFin,
        duracion: this.duracion,
      });
    } else {
      this.programar.emit({
        aplicacion: this.aplicacion,
        examenes: this.examenes,
        laboratorios: this.laboratorios,
        camilla: this.camilla
      });
    }
  }

  cancelar() {
    this.cerrar.emit();
  }
}

