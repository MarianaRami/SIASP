import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {
  private apiUrl = 'http://localhost:3000/gestion-pacientes';

  constructor(private http: HttpClient) { }
  private readonly authService = inject(AuthService);

  // ------------------- AUTH -------------------

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // ------------------- PROGRAMACION (CONSULTAR PACIENTE) -------------------

  programacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/programacion-ciclo`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  pacienteObservacionMed(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/observacion-ciclo`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  editarEventoAplicacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/editar-evento-aplicacion-paciente`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  cancelarCiclo(dto: any): Observable<any> { 
    return this.http.post<any>(
      `${this.apiUrl}/cancelar-ciclo`,  
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  programarSilla(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/programar-silla`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  // ------------------- PROGRAMACION (NOTIFICACIÓN) -------------------
  getlistadoPacientesNotificacion(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-notificacion`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ------------------- PROGRAMACION (CONFIRMACIÓN) -------------------
  getlistadoPacientesConfirmacion(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-confirmacion`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ------------------- PROGRAMACION (DISPONIBILIDAD DE SALA) -------------------
  getlistadoSillasDisponibles(tipo: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/lista-sillas/${tipo}`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  getasignacionSillaPaciente(fecha: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/asignacion-sillas/${fecha}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ------------------- PROGRAMACION (NOTIFICACIÓN AL PACIENTE) -------------------
  notificacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/notificacion-ciclo`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  // ------------------- PROGRAMACION (CONFIRMACIÓN AL PACIENTE) -------------------
  confirmacionPaciente(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/confirmacion-evento`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }
  
  // ------------------- PROGRAMACION (JEFE ENFERMERIA) -------------------
  getListadoPacientesJefeEnfermeria(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes_precancelados`,
      { headers: this.getAuthHeaders() }
    );
  }

  registrarDecisionesJefe(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/confirmacion-cancelacion`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  // ------------------- PROGRAMACION (REPROGRAMACIÓN) -------------------
  getListadoPacientesReprogramacion(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-reprogramacion`,
      { headers: this.getAuthHeaders() }
    );
  }

}
