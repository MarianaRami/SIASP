import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {

  private baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  getErroresMedicamentos(fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-errores-medicamentos/${fechaIni}/${fechaFin}`);
  }

  getAuditoriaPaciente(documento: string, fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-auditoria-paciente/${documento}/${fechaIni}/${fechaFin}`);
  }

  getOportunidadInicio(fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-oportunidad-inicio/${fechaIni}/${fechaFin}`);
  }

  getCambioProtocolo(fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-cambio-protocolo/${fechaIni}/${fechaFin}`);
  }

  getFallecidos(fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-fallecidos-desistidos/${fechaIni}/${fechaFin}`);
  }

  getOcupacionSillas(fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-ocupacion-sillas/${fechaIni}/${fechaFin}`);
  }

  getToxicidad(fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-pacientes/reporte-toxicidad/${fechaIni}/${fechaFin}`);
  }
}
