import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../services/gestion-pacientes.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-director-farmacia',
  imports: [CommonModule, FormsModule],
  templateUrl: './director-farmacia.component.html',
  styleUrl: './director-farmacia.component.css'
})
export class DirectorFarmaciaComponent {

  fechaInicio: string = '';
  fechaFin: string = '';

  medicamentos: any[] = [];
  chart: any;

  constructor(private pacientesService: GestionPacientesService) {}

  buscar() {

    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor selecciona ambas fechas.');
      return;
    }

    this.pacientesService
      .getProyeccionMedicamentos(this.fechaInicio, this.fechaFin)
      .subscribe({

        next: (res) => {

          this.medicamentos = res.medicamentos;

          const labels: string[] = [];
          const data: number[] = [];

          this.medicamentos.forEach((med: any) => {
            med.presentaciones.forEach((pres: any) => {
              labels.push(`${med.medicamento}`);
              data.push(pres.cantidad);
            });
          });

          this.crearGrafica(labels, data);

        }

      });
  }

  crearGrafica(labels: string[], data: number[]) {

    // destruir gráfica anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('miGrafica', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de medicamentos',
          data: data
        }]
      },
      options: {
        responsive: true
      }
    });

  }

}