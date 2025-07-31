import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrl: './autorizacion.component.css',
  imports: [
    FormsModule, CommonModule,
    TablaDinamicaComponent
],
})
export class AutorizacionComponent {
  constructor(private router: Router) {}

  paciente = 'Ana María Torres López';
  identificacion = '5201919351';
  protocolo = 'Cáncer de mama estadio II – Protocolo FAC';
  eps = 'Sanitas';

  tipoOpciones = ['Individual', 'Universal']; 
  tipoSeleccionado = 'Individual';

  columnasIndividual = [
    { key: 'Medicamento', label: 'Medicamento' },
    { key: 'Presentacion', label: 'Presentación' },
    { key: 'Dosis', label: 'Dosis' },
    { key: 'Unidad', label: 'Unidad' }
  ];

  columnasUniversal = [
    { key: 'Medicamento', label: 'Medicamento' },
    { key: 'Presentacion', label: 'Presentación' },
    { key: 'Dosis', label: 'Dosis' },
    { key: 'Unidad', label: 'Unidad' },
    { key: 'Autorizacion', label: 'No. Autorización', tipo: 'text' },
    { key: 'Fecha', label: 'Fecha', tipo: 'fecha' }
  ];

  datos = [
    {
      Medicamento: '1',
    },
    {
      Medicamento: '2',
    },
    {
      Medicamento: '3',

    }
  ];

  volver() {
    this.router.navigate(['autorizaciones/busquedaAU'])
  }

  Cancelar() {

  }

  Guardar() {

  }

}
