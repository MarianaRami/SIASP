import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component.spec';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-examenes',
  standalone: true,
  templateUrl: './administrador-sistema.component.html',
  styleUrls: ['./administrador-sistema.component.css'],
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class AdministradorSistemaComponent {

mostrarInactivos = false;

datos = [
  {
    Protocolo: 'Protocolo',
    Versión: '1',
    Fecha: '01/09/2025',
    Estado: 'Activo',
  },
  {
    Protocolo: 'Prueba',
    Versión: '1',
    Fecha: '01/09/2025',
    Estado: 'Inactivo',
  }
];

datosFiltrados = [...this.datos];

filtrarDatos() {
  if (this.mostrarInactivos) {
    this.datosFiltrados = this.datos;
  } else {
    this.datosFiltrados = this.datos.filter(d => d.Estado !== 'Inactivo');
  }
}


handleBuscar($event: string) {
throw new Error('Method not implemented.');
}
agregar() {
throw new Error('Method not implemented.');
}
filtro: any;

  columnas = [
    { key: 'Protocolo', label: 'Protocolo' },
    { key: 'Estado', label: 'Estado'},
    { key: 'boton', label: ''}
  ];
}

