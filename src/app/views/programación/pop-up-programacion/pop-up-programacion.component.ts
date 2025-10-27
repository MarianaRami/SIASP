import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-programacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up-programacion.component.html',
  styleUrl: './pop-up-programacion.component.css'
})
export class PopUpProgramacionComponent {
  @Input() modo: 'programar' | 'editar' = 'programar';
  @Output() cerrar = new EventEmitter<void>();
  @Output() programar = new EventEmitter<{ aplicacion?: string; examenes?: string; laboratorios?: string; fechaEvento?: string; camilla?: boolean }>();

  aplicacion = '';
  examenes = '';
  laboratorios = '';

  fechaEvento = '';

  camilla: boolean = false;

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    if (this.modo === 'editar') {
      this.programar.emit({
        fechaEvento: this.fechaEvento,
        camilla: this.camilla
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

