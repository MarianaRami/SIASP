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
  imports: [
    CommonModule
  ],
  templateUrl: './reporte-calendario.component.html',
  styleUrl: './reporte-calendario.component.css'
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

    // Dos salas con 15 sillas y 2 camillas cada una
    this.salas = [
      { id: 1, posiciones: [...Array(15).keys()].map(i => `Silla ${i + 1}`).concat(['Camilla 1', 'Camilla 2']) },
      { id: 2, posiciones: [...Array(15).keys()].map(i => `Silla ${i + 1}`).concat(['Camilla 1', 'Camilla 2']) },
    ];

    // Datos dummy de pacientes
    const nombres = ['María Pérez', 'Juan Gómez', 'Ana Torres', 'Carlos Ruiz', 'Laura Díaz', 'José Martínez', 'Elena Castro', 'Pedro López', 'Santiago Hernandez', 'Paula Marin'];
    const horasPosibles = ['7:00', '8:00', '9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    for (let sala of this.salas) {
      for (let pos of sala.posiciones) {
        if (Math.random() > 0.75) { // 25% de probabilidad de estar ocupada
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

  getPaciente(salaId: number, posicion: string, hora: string): PacienteTurno | undefined {
    // Buscar si hay un paciente que esté ocupando esta posición en este rango horario
    const horaNum = parseInt(hora.split(':')[0]);
    return this.pacientes.find(p => {
      const horaInicio = parseInt(p.horaInicio.split(':')[0]);
      const horaFin = horaInicio + p.duracion;
      return p.sala === salaId && p.posicion === posicion && horaNum >= horaInicio && horaNum < horaFin;
    });
  }

  calcularHoraFin(paciente: PacienteTurno): string {
    const inicio = parseInt(paciente.horaInicio.split(':')[0]);
    const fin = inicio + paciente.duracion;
    return `${fin}:00`;
  }

}
