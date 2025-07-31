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

  aplicacion = '';
  examenes = '';
  laboratorios = '';

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    this.cerrar.emit();
  }

  cancelar() {
    this.cerrar.emit();
  }
}
