import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from '../popup-cambio-protocolo/popup-cambio-protocolo.component';
import { PopupProtocoloComponent } from '../popup-protocolo/popup-protocolo.component';


@Component({
  selector: 'app-paciente',
  imports: [
    PopupCambioProtocoloComponent, PopupProtocoloComponent,
    FormsModule,CommonModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
  constructor(private router: Router) {}

  mostrarPopup = false;
  mostrarPopupPr = false;

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  abrirPopupPr() {
    this.mostrarPopupPr = true;
  }

  cerrarPopupPr() {
    this.mostrarPopupPr = false;
  }

  paciente = 'Ana María Torres López';
  identificacion = '5201919351';
  medico = 'Dr. Carlos Méndez';
  protocolo = 'Cáncer de mama estadio II – Protocolo FAC';
  eps = 'Sanitas';
  cie10 = '';
  peso = '';
  superficie = '';
  tfg = '';
  especialidad = 'Oncología Clínica';


  anadirCiclo() {
    this.router.navigate(['qf/busqueda/paciente/protocolo'])
  }

  editar() {
    this.router.navigate(['qf/busqueda/paciente/cambio_protocolo'])
  }

  volver() {
    this.router.navigate(['qf/busqueda'])
  }
}