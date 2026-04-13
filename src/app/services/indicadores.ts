import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {

  private baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  getErroresMedicamentos(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-errores-medicamentos`, body);
  }

  getAuditoriaPaciente(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-auditoria-paciente`, body);
  }

  getOportunidadInicio(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-oportunidad-inicio`, body);
  }

  getCambioProtocolo(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-cambio-protocolo`, body);
  }

  getFallecidos(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-fallecidos-desistidos`, body);
  }

  getOcupacionSillas(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-ocupacion-sillas`, body);
  }

  getToxicidad(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-toxicidad`, body);
  }
}
