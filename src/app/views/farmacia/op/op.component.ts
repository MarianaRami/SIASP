import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-op',
  templateUrl: './op.component.html',
  styleUrl: './op.component.css',
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class OPComponent {
  constructor(private router: Router) {}

  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Ubicación', label: 'Ubicación'},
    { key: 'Medicamento', label: 'Medicamento' },
    { Key: 'Dosis', label: 'Dosis'},
    { key: 'Via', label: 'Via' },
    { key: 'Vehiculo', label: 'Vehiculo' }
  ];
  datos = [
    {
      Nombre: 'Juan Pérez',
      Cedula: '123456789',
    },
    {
      Nombre: 'María Gómez',
      Cedula: '987654321',
    },
    {
      Nombre: 'Carlos Ruiz',
      Cedula: '456789123',
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

  volver() {
    this.router.navigate(['programacion/menuConfirmacion'])
  }

  descarga() {
    
  }

}
