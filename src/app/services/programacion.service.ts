import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../core/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {
  private readonly api = inject(ApiClient);

  // ------------------- PROGRAMACION (CONSULTAR PACIENTE) -------------------

  programacionPaciente(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/programacion-ciclo', dto);
  }

  pacienteObservacionMed(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/observacion-ciclo', dto);
  }

  editarEventoAplicacionPaciente(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/editar-evento-aplicacion-paciente', dto);
  }

  cancelarCiclo(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/cancelar-ciclo', dto);
  }

  programarSilla(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/programar-silla', dto);
  }

  // ------------------- PROGRAMACION (NOTIFICACIÓN) -------------------

  getlistadoPacientesNotificacion(): Observable<any> {
    return this.api.get<any>('/gestion-pacientes/pacientes-notificacion');
  }

  // ------------------- PROGRAMACION (CONFIRMACIÓN) -------------------

  getlistadoPacientesConfirmacion(): Observable<any> {
    return this.api.get<any>('/gestion-pacientes/pacientes-confirmacion');
  }

  // ------------------- PROGRAMACION (DISPONIBILIDAD DE SALA) -------------------

  getlistadoSillasDisponibles(tipo: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/lista-sillas/${tipo}`);
  }

  getasignacionSillaPaciente(fecha: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/asignacion-sillas/${fecha}`);
  }

  getDisponibilidadSillas(fecha: string, duracion: number, tipo: 'silla' | 'camilla' | 'habitacion'): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/disponibilidad-sillas/${fecha}/${duracion}/${tipo}`);
  }

  // ------------------- PROGRAMACION (NOTIFICACIÓN AL PACIENTE) -------------------

  notificacionPaciente(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/notificacion-ciclo', dto);
  }

  // ------------------- PROGRAMACION (CONFIRMACIÓN AL PACIENTE) -------------------

  confirmacionPaciente(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/confirmacion-evento', dto);
  }

  // ------------------- PROGRAMACION (JEFE ENFERMERIA) -------------------

  getListadoPacientesJefeEnfermeria(): Observable<any> {
    return this.api.get<any>('/gestion-pacientes/pacientes_precancelados');
  }

  registrarDecisionesJefe(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/confirmacion-cancelacion', dto);
  }

  // ------------------- PROGRAMACION (REPROGRAMACIÓN) -------------------

  getListadoPacientesReprogramacion(): Observable<any> {
    return this.api.get<any>('/gestion-pacientes/pacientes-reprogramacion');
  }

  // ------------------- PROGRAMACION (CAMBIO FECHA EXÁMENES) -------------------

  programarExamenesPaciente(payload: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/programacion-examenes', payload);
  }
}
