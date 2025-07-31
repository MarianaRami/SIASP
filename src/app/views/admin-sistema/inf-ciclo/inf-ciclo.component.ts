import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inf-ciclo',
  imports: [ CommonModule, FormsModule],
  templateUrl: './inf-ciclo.component.html',
  styleUrl: './inf-ciclo.component.css'
})
export class InfCicloComponent {
  constructor(private router: Router) {}

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


    const ciclo = {
      numeroCiclo: this.numeroCiclo,
      duracionCiclo: this.duracionCiclo,
      necesitaExamenes: this.necesitaExamenes,
      eventos: this.eventos
    };

      this.router.navigate(
      ['admin-sistema/Protocolo/Info-Ciclo/Info-Medicamentos'],
      { state: { ciclo } }
    );
  }

  volver() {
    this.router.navigate(['admin-sistema/Nuevo-protocolo']);
  }

}
