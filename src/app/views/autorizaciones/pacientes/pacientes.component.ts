import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ],
})
export class PacientesComponent {
  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Telefono', label: 'Telefono' },
    { key: 'Medico', label: 'Medico tratante' },
    { key: 'Check', label: ' ', tipo: 'checkbox'}
  ];
  datos = [
    {
      Nombre: 'Juan Pérez',
      Cedula: '123456789',
      Fecha: '2025-05-20'
    },
    {
      Nombre: 'María Gómez',
      Cedula: '987654321',
      Fecha: '2025-05-22'
    },
    {
      Nombre: 'Carlos Ruiz',
      Cedula: '456789123',
      Fecha: '2025-05-24'
    }
  ];

  filtro: string = '';
  datosFiltrados = [...this.datos];

  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
      d.Cedula.includes(f) || d.Nombre.toLowerCase().includes(f)
    );
  }

  Guadar() {
    
  }

}
