import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../services/gestion-pacientes.service';

interface ExamenPaciente {
  nombre: string;
  cedula: string;
  examenesPendientes: [];
  estado: string;
  observación: string;
}

@Component({
  selector: 'app-examenes',
  standalone: true,
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
  imports: [TablaDinamicaComponent, CommonModule, FormsModule]
})
export class ExamenesComponent {
  constructor(private miServicio: GestionPacientesService) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'examenesPendientes', label: 'Examenes' },
    {
      key: 'estado',
      label: 'Estado',
      tipo: 'select',
      opciones: ['Confirmado', 'Reprogramar']
    },
    { key: 'observación', label: 'Observación' }
  ];

  datos: ExamenPaciente[] = [];
  datosFiltrados: ExamenPaciente[] = [];

  fechaActual: Date = new Date();
  filtro: string = '';

  ngOnInit() {
    console.log('Fecha actual:', this.fechaActual.toISOString());
    this.miServicio.getlistadoExamenesPaciente(this.fechaActual).subscribe({
      next: (res: ExamenPaciente[]) => {
        console.log('✅ Listado de exámenes del paciente:', res);
        this.datos = res;
        this.datosFiltrados = [...this.datos];
      },
      error: (err) =>
        console.error('❌ Error al obtener listado de exámenes del paciente:', err)
    });
  }

  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(
      (d) =>
        d.cedula.includes(f) ||
        d.nombre.toLowerCase().includes(f)
    );
  }
}

