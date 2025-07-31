import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conf-ciclo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conf-ciclo.component.html',
  styleUrl: './conf-ciclo.component.css'
})
export class ConfCicloComponent {
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.datosProtocolo = navigation?.extras?.state?.['protocolo'];
    console.log('Recibido:', this.datosProtocolo);
  }

  datosProtocolo: any;

  numeroCiclo: string = '';
  duracionCiclo: string = '';
  necesitaExamenes: boolean = false;

  eventos: any[] = [
    { dia: '', evento: '', observacion: '', activo: true }
  ];

  opcionesEvento = ['Exámenes', 'Aplicación', 'Otro'];

  agregarFila() {
    this.eventos.push({ dia: '', evento: '', observacion: '', activo: true });
  }

  eliminarFila(index: number) {
    this.eventos.splice(index, 1);
  }

  siguiente() {
    console.log({
      numeroCiclo: this.numeroCiclo,
      duracionCiclo: this.duracionCiclo,
      necesitaExamenes: this.necesitaExamenes,
      eventos: this.eventos
    });

    const datosProtocolo = this.datosProtocolo;

    const payload = {
      nombreProtocolo: datosProtocolo.nombreProtocolo,
      descripción: datosProtocolo.descripcion,
      medicamentos: datosProtocolo.medicamentos,
      numeroCiclo: this.numeroCiclo,
      duracionCiclo: this.duracionCiclo,
      necesitaExamenes: this.necesitaExamenes,
      eventos: this.eventos
    };

      this.router.navigate(
      ['admin-sistema/Nuevo-protocolo/Conf-Ciclo/Conf-Medicamento'],
      { state: { payload } }
    );
  }

  volver() {
    this.router.navigate(['admin-sistema/Nuevo-protocolo']);
  }
}

