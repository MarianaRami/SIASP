import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


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
  constructor(private router: Router) {}
  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Observacion', label: 'Observación' },
    { key: 'boton', label: '', tipo: 'button' },
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

  handleBuscar(fila: any) {
    console.log('Cédula recibida:', fila.Cedula);  
    this.router.navigate(['/qf/observaciones/medicamentos']);
  }
}
