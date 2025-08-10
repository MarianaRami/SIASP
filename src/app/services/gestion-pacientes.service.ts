import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PacienteResponse } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class GestionPacientesService {
  private apiUrl = 'http://localhost:3000/gestion-pacientes'; // ajusta a tu URL real

  constructor(private http: HttpClient) {}
  private readonly authService = inject(AuthService);

  // ------------------- AUTH -------------------

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // ------------------- PACIENTES -------------------

  getPacienteCompletoByDocumento(documento: string): Observable<PacienteResponse> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes/documento/${documento}`,{
        headers: this.getAuthHeaders()
      }
    );
  }

  createPacienteNuevoCompleto(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/nuevo-paciente/`, dto,
      { headers: this.getAuthHeaders() }
    );
  }
}
