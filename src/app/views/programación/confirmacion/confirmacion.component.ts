import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css',
  imports: [
      TablaDinamicaComponent,
      CommonModule, FormsModule
    ]
})
export class ConfirmacionComponent {
  constructor(private router: Router) {}

  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Telefono', label: 'Telefono' },
    { key: 'Estado', label: 'Estado', tipo: 'select', opciones: ['Confirmado', 'Reprogramar'] },
    { key: 'Observaciones', label: 'Observaciones', tipo: 'text' },
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

}
