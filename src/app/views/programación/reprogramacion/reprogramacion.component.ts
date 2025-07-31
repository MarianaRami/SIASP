import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reprogramacion',
  templateUrl: './reprogramacion.component.html',
  styleUrl: './reprogramacion.component.css',
  imports: [
      TablaDinamicaComponent,
      CommonModule, FormsModule
  ]
})
export class ReprogramacionComponent {
  constructor(private router: Router) {}

  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Protocolo', label: 'Protocolo' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Motivo', label: 'Motivo' }, 
    { key: 'Boton', label: ' ', tipo: 'button'}
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

  handleBuscar(fila: any) {
    console.log('Cédula recibida:', fila.Cedula);  
    this.router.navigate(['/programacion/busquedaPro/historial']);
  }

  volver() {
    this.router.navigate(['programacion'])
  }
}
