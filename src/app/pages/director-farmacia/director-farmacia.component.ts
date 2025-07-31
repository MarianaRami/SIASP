import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-director-farmacia',
  imports: [CommonModule, FormsModule],
  templateUrl: './director-farmacia.component.html',
  styleUrl: './director-farmacia.component.css'
})
export class DirectorFarmaciaComponent {
  constructor(private router: Router) {}

  fechaInicio: string = '';
  fechaFin: string = '';

  @Output() filtrar = new EventEmitter<{ desde: string; hasta: string }>();

  buscar() {
    if (this.fechaInicio && this.fechaFin) {
      this.filtrar.emit({ desde: this.fechaInicio, hasta: this.fechaFin });
      this.router.navigate(['director-farmacia/lista'])
    } else {
      alert('Por favor selecciona ambas fechas.');
    }
  }

}
