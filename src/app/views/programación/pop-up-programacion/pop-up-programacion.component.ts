import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-programacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up-programacion.component.html',
  styleUrl: './pop-up-programacion.component.css'
})
export class PopUpProgramacionComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() programar = new EventEmitter<{ aplicacion: string; examenes: string; laboratorios: string }>();

  aplicacion = '';
  examenes = '';
  laboratorios = '';

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    this.programar.emit({
      aplicacion: this.aplicacion,
      examenes: this.examenes,
      laboratorios: this.laboratorios
    });
  }

  cancelar() {
    this.cerrar.emit();
  }
}

