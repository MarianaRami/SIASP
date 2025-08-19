import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { PopUpMedicamentosComponent } from '../pop-up-medicamentos/pop-up-medicamentos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-ciclo',
  imports: [
    TablaDinamicaComponent, PopUpMedicamentosComponent,
    FormsModule, CommonModule
  ],
  templateUrl: './configuracion-ciclo.component.html',
  styleUrl: './configuracion-ciclo.component.css'
})
export class ConfiguracionCicloComponent {
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
  fecha_consulta = '';
  cie10 = '';
  peso = '';
  superficie = '';
  tfg = '';
  conf_medicamentos: '' | undefined;

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
