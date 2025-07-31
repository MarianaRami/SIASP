import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrl: './observaciones.component.css',
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ],
})
export class ObservacionesComponent {
handleBuscar($event: string) {
throw new Error('Method not implemented.');
}
  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Observacion', label: 'Observacion' },
    { key: 'boton', label: '' },
  ];
  datos = [
    { 
      Nombre: 'Ana Ruiz', 
      Cedula: '12345678', 
      Observacion: '' 
    },
    { Nombre: 'Carlos Soto', 
      Cedula: '87654321', 
      Observacion: '' }
  ];
}
