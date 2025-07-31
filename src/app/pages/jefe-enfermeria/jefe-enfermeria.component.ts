import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component.spec';

@Component({
  selector: 'app-jefe-enfermeria',
  templateUrl: './jefe-enfermeria.component.html',
  styleUrl: './jefe-enfermeria.component.css',
  imports: [TablaDinamicaComponent]
})
export class JefeEnfermeriaComponent {
  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Teléfono', label: 'Teléfono' },
    { key: 'Estado', label: 'Estado', tipo: 'select', opciones: ['Reprogramación', 'Cancelar protocolo'] }
  ];
  datos = [
    { Nombre: 'Ana Ruiz', Cedula: '12345678', Teléfono: '3216549870', Estado: '' },
    { Nombre: 'Carlos Soto', Cedula: '87654321', Teléfono: '3123456789', Estado: ''}
  ];
}
