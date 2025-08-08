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
    const datos = navigation?.extras?.state?.['protocolo'];
    this.datosProtocolo = datos;

    // Si hay datos, cargar al formulario
    if (datos) {
      this.numeroCiclo = datos.numeroCiclo || '';
      this.duracionCiclo = datos.duracionCiclo || '';
      this.necesitaExamenes = datos.necesitaExamenes || false;
      this.eventos = datos.eventos?.length > 0
        ? datos.eventos
        : [{ dia: '', evento: '', observacion: '', activo: true }];
    }
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

  esFormularioValido(): boolean {
    // Validar campos principales
    if (!this.numeroCiclo || !this.duracionCiclo) {
      return false;
    }

    // Validar cada evento
    for (let evento of this.eventos) {
      if (
        evento.activo && (
          evento.dia === '' ||
          evento.evento === '' ||
          evento.observacion === ''
        )
      ) {
        return false;
      }
    }

    return true;
  }

  siguiente() {
    if (!this.numeroCiclo.trim() || !this.duracionCiclo.trim()) {
      alert('Por favor completa el numero de ciclos y la duración del ciclo.');
      return;
    }

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
    this.router.navigate(
      ['admin-sistema/Nuevo-protocolo'],
      { state: { protocolo: this.datosProtocolo } }
  );
  }
}

