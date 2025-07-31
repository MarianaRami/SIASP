import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component.spec';

@Component({
  selector: 'app-enfermeria',
  templateUrl: './enfermeria.component.html',
  styleUrls: ['./enfermeria.component.css'],
  imports: [TablaDinamicaComponent]
})
export class EnfermeriaComponent {
  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Teléfono', label: 'Teléfono' },
    { key: 'Estado', label: 'Estado', tipo: 'select', opciones: ['Asistió', 'Suspendida', 'Reprogramar'] },
    { key: 'Observaciones', label: 'Observaciones' }
  ];
  datos = [
    { Nombre: 'Ana Ruiz', Cedula: '12345678', Teléfono: '3216549870', Estado: '', Observaciones: '' },
    { Nombre: 'Carlos Soto', Cedula: '87654321', Teléfono: '3123456789', Estado: '', Observaciones: '' }
  ];
}
