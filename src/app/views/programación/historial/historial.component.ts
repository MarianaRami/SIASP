import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupMotivoComponent } from '../../../components/popup-motivo/popup-motivo.component';
import { PopupMedicamentosObvComponent } from '../popup-medicamentos-obv/popup-medicamentos-obv.component';
import { PopUpProgramacionComponent } from '../pop-up-programacion/pop-up-programacion.component';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
  imports: [
    FormsModule, CommonModule,
    TablaDinamicaComponent, PopupMotivoComponent, PopupMedicamentosObvComponent, PopUpProgramacionComponent
  ]
})
export class HistorialComponent {
  constructor(private router: Router) {}

  paciente = 'Ana María Torres López';
  identificacion = '5201919351';
  medico = 'Dr. Carlos Méndez';
  protocolo = 'Cáncer de mama estadio II – Protocolo FAC';
  telefono = ''; 
  tipo = '';
  tratamiento = '';
  especialidad = 'Oncología Clínica';

  columnas = [
    { key: 'Ciclo', label: 'ciclo' },
    { key: 'Sesion', label: 'Sesión' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Estado', label: 'Estado' },
    { key: 'Boton', label: ' ', tipo: 'button' }
  ];
  datos = [
    {
      Ciclo: '1',
      Sesion: '1',
      Fecha: '2025-05-20',
      Estado: '',
    },
    {
      Ciclo: '1',
      Sesion: '2',
      Fecha: '2025-05-21',
      Estado: '',
    },
    {
      Ciclo: '1',
      Sesion: '3',
      Fecha: '2025-05-22',
      Estado: '',
    }
  ];

  programar() {

  }

  volver() {
    this.router.navigate(['programacion/busquedaPro'])
  }

  historial() {
    this.router.navigate(['programacion/busquedaPro/historial/historial'])
  }

  // Pop up motivo
  mostrarPopup = false;

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  // Pop up medicamentos
  mostrarPopupM = false;

  abrirPopupM() {
    this.mostrarPopupM = true;
  }

  cerrarPopupM() {
    this.mostrarPopupM = false;
  }

  // Pop up programación
  mostrarPopupP = false;

  abrirPopupP() {
    this.mostrarPopupP = true;
  }

  cerrarPopupP() {
    this.mostrarPopupP = false;
  }
}
