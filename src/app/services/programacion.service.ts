import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {
  private apiUrl = 'http://localhost:3000/gestion-pacientes';

  constructor(private http: HttpClient) { }

  // ------------------- PROGRAMACION (CONSULTAR PACIENTE) -------------------

  programacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/programacion-ciclo`,
      dto
    );
  }

  pacienteObservacionMed(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/observacion-ciclo`,
      dto
    );
  }

  editarEventoAplicacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/editar-evento-aplicacion-paciente`,
      dto
    );
  }

  cancelarCiclo(dto: any): Observable<any> { 
    return this.http.post<any>(
      `${this.apiUrl}/cancelar-ciclo`,  
      dto
    );
  }

  programarSilla(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/programar-silla`,
      dto
    );
  }

  // ------------------- PROGRAMACION (NOTIFICACIÓN) -------------------
  getlistadoPacientesNotificacion(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-notificacion`
    );
  }

  // ------------------- PROGRAMACION (CONFIRMACIÓN) -------------------
  getlistadoPacientesConfirmacion(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-confirmacion`
    );
  }

  // ------------------- PROGRAMACION (DISPONIBILIDAD DE SALA) -------------------
  getlistadoSillasDisponibles(tipo: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/lista-sillas/${tipo}`
    );
  }
  
  getasignacionSillaPaciente(fecha: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/asignacion-sillas/${fecha}`
    );
  }

  // ------------------- PROGRAMACION (NOTIFICACIÓN AL PACIENTE) -------------------
  notificacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/notificacion-ciclo`,
      dto
    );
  }

  // ------------------- PROGRAMACION (CONFIRMACIÓN AL PACIENTE) -------------------
  confirmacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/confirmacion-evento`,
      dto
    );
  }
  
  // ------------------- PROGRAMACION (JEFE ENFERMERIA) -------------------
  getListadoPacientesJefeEnfermeria(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes_precancelados`
    );
  }

  registrarDecisionesJefe(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/confirmacion-cancelacion`,
      dto
    );
  }

  // ------------------- PROGRAMACION (REPROGRAMACIÓN) -------------------
  getListadoPacientesReprogramacion(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-reprogramacion`
    );
  }

}
