import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../services/gestion-pacientes.service';
import { Chart } from 'chart.js/auto';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';

@Component({
  selector: 'app-director-farmacia',
  standalone: true,
  imports: [CommonModule, FormsModule, TablaDinamicaComponent],
  templateUrl: './director-farmacia.component.html',
  styleUrl: './director-farmacia.component.css'
})
export class DirectorFarmaciaComponent {

  fechaInicio: string = '';
  fechaFin: string = '';

  // 🔹 DATA ORIGINAL
  medicamentos: any[] = [];       // consolidado
  reportePorDia: any[] = [];      // por día

  // 🔹 TABLAS
  datosTablaConsolidado: any[] = [];
  datosTablaPorDia: any[] = [];

  columnasConsolidado = [
    { key: 'medicamento', label: 'Medicamento' },
    { key: 'presentacion', label: 'Presentación' },
    { key: 'cantidad', label: 'Cantidad' }
  ];

  columnasPorDia = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'medicamento', label: 'Medicamento' },
    { key: 'presentacion', label: 'Presentación' },
    { key: 'cantidad', label: 'Cantidad' }
  ];

  // 🔹 GRÁFICAS
  chartConsolidado: any;
  chartPorDia: any;

  constructor(private pacientesService: GestionPacientesService) {}

  buscar() {

    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor selecciona ambas fechas.');
      return;
    }

    this.cargarConsolidado();
    this.cargarPorDia();
  }

  // ================= CONSOLIDADO =================
  cargarConsolidado() {
    this.pacientesService
      .getProyeccionMedicamentos(this.fechaInicio, this.fechaFin)
      .subscribe(res => {

        this.medicamentos = res.medicamentos || [];

        this.mapearTablaConsolidado();
        this.generarGraficaConsolidado();
      });
  }

  mapearTablaConsolidado() {
    const data: any[] = [];

    this.medicamentos.forEach(med => {
      med.presentaciones.forEach((pres: any) => {
        data.push({
          medicamento: med.medicamento,
          presentacion: pres.presentacion,
          cantidad: Number(pres.cantidad)
        });
      });
    });

    this.datosTablaConsolidado = data;
  }

  generarGraficaConsolidado() {

    const labels: string[] = [];
    const data: number[] = [];

    this.medicamentos.forEach(med => {
      med.presentaciones.forEach((pres: any) => {
        labels.push(med.medicamento);
        data.push(Number(pres.cantidad));
      });
    });

    this.crearGrafica('miGrafica', labels, data, 'consolidado');
  }

  // ================= POR DÍA =================
  cargarPorDia() {
    this.pacientesService
      .getProyeccionMedicamentosPorDia(this.fechaInicio, this.fechaFin)
      .subscribe(res => {

        this.reportePorDia = res.reporte || [];

        this.mapearTablaPorDia();
        this.generarGraficaPorDia();
      });
  }

  mapearTablaPorDia() {
    const data: any[] = [];

    this.reportePorDia.forEach((dia: any) => {
      dia.medicamentos.forEach((med: any) => {
        med.presentaciones.forEach((pres: any) => {
          data.push({
            fecha: this.formatearFecha(dia.fecha),
            medicamento: med.medicamento,
            presentacion: pres.presentacion,
            cantidad: Number(pres.cantidad)
          });
        });
      });
    });

    this.datosTablaPorDia = data;
  }

  generarGraficaPorDia() {

  if (this.chartPorDia) {
    this.chartPorDia.destroy();
  }

  // 1️⃣ Obtener fechas únicas ordenadas
  const fechasUnicas: string[] = [
    ...new Set(
      this.reportePorDia.map(d => this.formatearFecha(d.fecha))
    )
  ];

  // 2️⃣ Obtener medicamentos únicos
  const medicamentosSet = new Set<string>();

  this.reportePorDia.forEach((dia: any) => {
    dia.medicamentos.forEach((med: any) => {
      medicamentosSet.add(med.medicamento);
    });
  });

  const medicamentos = Array.from(medicamentosSet);

  // 3️⃣ Crear datasets alineados
  const datasets = medicamentos.map(nombreMed => {

    const data = fechasUnicas.map(fecha => {

      const dia = this.reportePorDia.find(
        (d: any) => this.formatearFecha(d.fecha) === fecha
      );

      if (!dia) return 0;

      const med = dia.medicamentos.find(
        (m: any) => m.medicamento === nombreMed
      );

      if (!med) return 0;

      // sumar todas las presentaciones
      return med.presentaciones.reduce(
        (sum: number, p: any) => sum + Number(p.cantidad || 0),
        0
      );
    });

    return {
      label: nombreMed,
      data: data,
      fill: false,
      tension: 0.3
    };
  });

  // 4️⃣ Crear gráfica
  this.crearGraficaMultiLinea(fechasUnicas, datasets);
}

  // ================= CREAR GRÁFICAS =================
  crearGrafica(
    canvasId: string,
    labels: string[],
    data: number[],
    tipo: 'consolidado' | 'dia'
  ) {

    setTimeout(() => {

      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

      if (!canvas) {
        console.warn('Canvas aún no renderizado, reintentando...');
        setTimeout(() => this.crearGrafica(canvasId, labels, data, tipo), 50);
        return;
      }

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('No se pudo obtener el contexto');
        return;
      }

      // destruir si existe
      if (tipo === 'consolidado' && this.chartConsolidado) {
        this.chartConsolidado.destroy();
      }

      if (tipo === 'dia' && this.chartPorDia) {
        this.chartPorDia.destroy();
      }

      const nuevaGrafica = new Chart(ctx, {
        type: tipo === 'dia' ? 'line' : 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Cantidad',
            data
          }]
        },
        options: {
          responsive: true
        }
      });

      if (tipo === 'consolidado') {
        this.chartConsolidado = nuevaGrafica;
      } else {
        this.chartPorDia = nuevaGrafica;
      }

    }, 0); // 🔥 clave
  }

  crearGraficaMultiLinea(labels: string[], datasets: any[]) {
    if (this.chartPorDia) {
      this.chartPorDia.destroy();
    }

    setTimeout(() => {

      const canvas = document.getElementById('miGraficaPorDia') as HTMLCanvasElement;

      if (!canvas) {
        setTimeout(() => this.crearGraficaMultiLinea(labels, datasets), 50);
        return;
      }
      const ctx = canvas?.getContext('2d');

      if (!ctx) return;

      this.chartPorDia = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });

    }, 0);
  }

  

  // ================= UTIL =================
  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
  }
}