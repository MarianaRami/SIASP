import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-historial-paciente',
  imports: [TablaDinamicaComponent],
  templateUrl: './historial-paciente.component.html',
  styleUrl: './historial-paciente.component.css'
})
export class HistorialPacienteComponent {
  constructor(private router: Router) {}

  columnas = [
    { key: 'Ciclo', label: 'Ciclo' },
    { key: 'Aplicación', label: 'Aplicación' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Estado', label: 'Estado' },
    { key: 'Observación', label: 'Observación' }
  ];
  datos = [
    { Ciclo: '1', Aplicación: '1'},
    { Ciclo: '1', Aplicación: '2'},
    { Ciclo: '1', Aplicación: '3'},
    { Ciclo: '2', Aplicación: '1'},
    { Ciclo: '2', Aplicación: '2'},
    { Ciclo: '3', Aplicación: '1'},
  ];

  volver() {
    this.router.navigate(['programacion/busquedaPro/historial'])
  }
}
