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

}
