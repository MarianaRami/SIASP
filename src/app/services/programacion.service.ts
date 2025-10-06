import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

  constructor() { }

  // Método que simula traer pacientes desde un backend
  getPacientesPorFecha(fecha: Date) {
    // Datos dummy
    const pacientes = [
      { fecha: new Date(2025, 8, 24), nombre: 'Juan Pérez', cita: '10:00 AM' },
      { fecha: new Date(2025, 8, 24), nombre: 'Ana Gómez', cita: '11:30 AM' },
      { fecha: new Date(2025, 8, 25), nombre: 'Carlos Ruiz', cita: '02:00 PM' },
      { fecha: new Date(2025, 8, 26), nombre: 'María López', cita: '09:15 AM' }
    ];

    // Filtrar solo los pacientes de la fecha seleccionada
    return pacientes.filter(
      p => p.fecha.toDateString() === fecha.toDateString()
    );
  }
}
