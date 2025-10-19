import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface PacienteTurno {
  sala: number;
  posicion: string;
  horaInicio: string;
  duracion: number;
  nombre: string;
}

@Component({
  selector: 'app-reporte-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-calendario.component.html',
  styleUrls: ['./reporte-calendario.component.css']
})
export class ReporteCalendarioComponent {
  fechaSeleccionada: string = '';
  horas: string[] = [];
  salas: { id: number; posiciones: string[] }[] = [];
  pacientes: PacienteTurno[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.fechaSeleccionada = params.get('date') || '';
      this.generarDatosDummy();
    });
  }

  generarDatosDummy() {
    // Horas desde 7:00 hasta 19:00
    for (let h = 7; h <= 19; h++) {
      this.horas.push(`${h}:00`);
    }

    // Dos salas con distintas cantidades
    this.salas = [
      { id: 1, posiciones: [...Array(80).keys()].map(i => `Silla ${i + 1}`).concat([...Array(10).keys()].map(i => `Camilla ${i + 1}`)) },
      { id: 2, posiciones: [...Array(20).keys()].map(i => `Silla ${i + 1}`).concat([...Array(10).keys()].map(i => `Camilla ${i + 1}`)) },
    ];

    // Datos de ejemplo
    const nombres = ['María Pérez', 'Juan Gómez', 'Ana Torres', 'Carlos Ruiz', 'Laura Díaz', 'José Martínez', 'Elena Castro', 'Pedro López', 'Santiago Hernández', 'Paula Marín'];
    const horasPosibles = ['7:00', '8:00', '9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    for (let sala of this.salas) {
      for (let pos of sala.posiciones) {
        if (Math.random() > 0.92) { // 8% probabilidad de estar ocupada
          const duracion = Math.floor(Math.random() * 3) + 1; // 1 a 3 horas
          const horaInicio = horasPosibles[Math.floor(Math.random() * horasPosibles.length)];

          this.pacientes.push({
            sala: sala.id,
            posicion: pos,
            horaInicio,
            duracion,
            nombre: nombres[Math.floor(Math.random() * nombres.length)]
          });
        }
      }
    }
  }

  getPacienteBloque(salaId: number, posicion: string, hora: string): PacienteTurno | null {
    const horaNum = parseInt(hora.split(':')[0]);
    const paciente = this.pacientes.find(p => {
      const inicio = parseInt(p.horaInicio.split(':')[0]);
      const fin = inicio + p.duracion;
      return p.sala === salaId && p.posicion === posicion && horaNum >= inicio && horaNum < fin;
    });

    if (!paciente) return null;

    // Mostrar solo en la hora de inicio
    const horaInicioNum = parseInt(paciente.horaInicio.split(':')[0]);
    return horaNum === horaInicioNum ? paciente : null;
  }

  calcularColspan(paciente: PacienteTurno): number {
    return paciente.duracion;
  }

  calcularHoraFin(paciente: PacienteTurno): string {
    const inicio = parseInt(paciente.horaInicio.split(':')[0]);
    const fin = inicio + paciente.duracion;
    return `${fin}:00`;
  }

  isHoraOcupada(salaId: number, posicion: string, hora: string): boolean {
    const horaNum = parseInt(hora.split(':')[0]);
    return this.pacientes.some(p => {
      const inicio = parseInt(p.horaInicio.split(':')[0]);
      const fin = inicio + p.duracion;
      return p.sala === salaId && p.posicion === posicion && horaNum > inicio && horaNum < fin;
    });
  }
}
