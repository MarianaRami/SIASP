import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PacienteResponse, DescripcionCicloPacienteCompleto, DescripcionCicloPacienteCompletoResponse } from '../models/paciente';
import { MedicamentoParaPresentacionDto } from '../models/descripcion-medicamentos';


@Injectable({
  providedIn: 'root'
})
export class AutorizacionesService {
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

  // ------------------- AUTORIZACIONES -------------------
  getPacienteByDocumento(pacienteId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes/autorizaciones/datos/${pacienteId}`,{
        headers: this.getAuthHeaders()
      }
    );
  }
}
