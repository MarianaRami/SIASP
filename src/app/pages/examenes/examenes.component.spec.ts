import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component.spec';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-examenes',
  standalone: true,
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class ExamenesComponent {
guardarCambios() {
throw new Error('Method not implemented.');
}
cambiarFecha() {
throw new Error('Method not implemented.');
}
fechaActual: any;
fechaSeleccionada: any;
actualizarExamenesPorFecha() {
throw new Error('Method not implemented.');
}
  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Protocolo', label: 'Protocolo' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Estado', label: 'Estado', tipo: 'select', opciones: ['Confirmado', 'Reprogramar', 'Precancelado'] }
  ];
  datos = [
    {
      Nombre: 'Juan Pérez',
      Cedula: '123456789',
      Protocolo: '',
      Fecha: '2025-05-20'
    },
    {
      Nombre: 'María Gómez',
      Cedula: '987654321',
      Protocolo: '',
      Fecha: '2025-05-22'
    },
    {
      Nombre: 'Carlos Ruiz',
      Cedula: '456789123',
      Protocolo: '',
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
}