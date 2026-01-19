import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteResponse, DescripcionCicloPacienteCompleto, DescripcionCicloPacienteCompletoResponse } from '../models/paciente';
import { MedicamentoParaPresentacionDto } from '../models/descripcion-medicamentos';


@Injectable({
  providedIn: 'root'
})
export class AutorizacionesService {
  private apiUrl = 'http://localhost:3000/gestion-pacientes';

  constructor(private http: HttpClient) { }

  // ------------------- AUTORIZACIONES -------------------
  getPacienteByDocumento(pacienteId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/autorizaciones/datos/${pacienteId}`
    );
  }

  createAutorizacionNueva(dto: any) {
    return this.http.post<any>(
      `${this.apiUrl}/autorizar-ciclo`,
      dto
    );
  }
}
