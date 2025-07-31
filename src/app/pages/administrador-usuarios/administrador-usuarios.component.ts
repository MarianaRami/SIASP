import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component.spec';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrador-usuarios',
  templateUrl: './administrador-usuarios.component.html',
  styleUrl: './administrador-usuarios.component.css',
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class AdministradorUsuariosComponent {
  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Rol', label: 'Rol' },
    { key: 'Estado', label: 'Estado', tipo: 'select', opciones: ['Activo', 'Bloqueado', 'Inactivo'] }
  ];
  datos = [
    {
      Nombre: 'Juan Pérez',
      Cedula: '123456789',
      Rol: 'Progrmador',
    },
    {
      Nombre: 'María Gómez',
      Cedula: '987654321',
      Rol: ''
    },
    {
      Nombre: 'Carlos Ruiz',
      Cedula: '456789123',
      Rol: ''
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

  Agregar() {

  }

  Roles() {

  }
}
