import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component.spec';

@Component({
  selector: 'app-protocolos',
  imports: [
    CommonModule, FormsModule,
    TablaDinamicaComponent
  ],
  templateUrl: './protocolos.component.html',
  styleUrl: './protocolos.component.css'
})
export class ProtocolosComponent {
  constructor(private router: Router) {}

  columnas = [
    { key: 'ciclo', label: 'Ciclo' },
    { key: 'dia', label: 'Día' },
    { key: 'tipo', label: 'Tipo de aplicación' }
  ];

  datos = [
    { ciclo: 1, dia: 1, tipo: 'Infusión' },
    { ciclo: 1, dia: 2, tipo: 'Inyección' },
    { ciclo: 2, dia: 1, tipo: 'Oral' },
    { ciclo: 2, dia: 2, tipo: 'Infusión' }
  ];

  protocolo = {
    nombre: 'Cáncer Pulmón',
    fechaCreacion: '06/07/2025',
    version: '1',
    usuarioCreador: 'mariana.ramirez'
  };
  
  volver() {
    this.router.navigate(['admin-sistema'])
  }

  editar() {
    this.router.navigate(['admin-sistema/Protocolo/Info-Ciclo'])
  }

  desactivar() {

  }
}

