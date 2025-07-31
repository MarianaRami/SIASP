import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { PopUpMedicamentosComponent } from '../pop-up-medicamentos/pop-up-medicamentos.component';


@Component({
  selector: 'app-protocolo',
  imports: [
    TablaDinamicaComponent, PopUpMedicamentosComponent,
    FormsModule, CommonModule
  ],
  templateUrl: './protocolo.component.html',
  styleUrl: './protocolo.component.css'
})
export class ProtocoloComponent {
  constructor(private router: Router) {}

  mostrarPopup = false;

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  protocolo = '';
  ciclo = '';
  fecha_asignacion = '';

  columnas = [
    { key: 'Aplicacion', label: 'No. Aplicación' },
    { key: 'Fecha', label: 'Fecha programada' },
    { key: 'Estado', label: 'Estado' }
  ];
  datos = [
    {
      Aplicacion: '1',
      Fecha: '2025-05-20',
      Estado: '',
    },
    {
      Aplicacion: '2',
      Fecha: '2025-05-21',
      Estado: '',
    },
    {
      Aplicacion: '3',
      Fecha: '2025-05-22',
      Estado: '',
    }
  ];

  volver() {
    this.router.navigate(['qf/busqueda/paciente'])
  }

}
