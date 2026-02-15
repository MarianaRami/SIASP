import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from "../popup-cambio-protocolo/popup-cambio-protocolo.component";
import { PopupProtocoloComponent } from "../popup-protocolo/popup-protocolo.component";
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { PacienteResponseDto } from '../../../models/paciente';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, PopupCambioProtocoloComponent, PopupProtocoloComponent, TablaDinamicaComponent],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
version: any;
mensajeError: any;
guardarCambio($event: any) {
throw new Error('Method not implemented.');
}
ciclos: any;
onGuardarPaciente($event: any) {
throw new Error('Method not implemented.');
}
columnas: any;
  datos!: any[];
pacienteData!: PacienteResponseDto ;
cerrarPopupPr() {
throw new Error('Method not implemented.');
}
abrirPopupPr() {
throw new Error('Method not implemented.');
}
mostrarPopup: any;
mostrarPopupPr: any;
cerrarPopup() {
throw new Error('Method not implemented.');
}
abrirPopup() {
throw new Error('Method not implemented.');
}
editar() {
throw new Error('Method not implemented.');
}
  constructor(private router: Router) {}

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

  cie10Opciones = ['A00 - Cólera', 'B20 - VIH', 'C34 - Cáncer de pulmón']; // ejemplo

  seleccionarProtocolo() {
    
  }

  configurarCiclo() {
    this.router.navigate(['qf/busqueda/paciente/protocolo'])
  }

  volver() {
    this.router.navigate(['qf/busqueda'])
  }
}
