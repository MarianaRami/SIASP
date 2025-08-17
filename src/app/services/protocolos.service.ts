import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Protocolo, ProtocoloCreate } from '../models/protocolo.model';

@Injectable({
  providedIn: 'root'
})
export class ProtocolosService {
  private baseUrl = 'http://localhost:3000';
  private token: string | null = null;
  private user: string | null = null;

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // ------------------- AUTH -------------------

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // ------------------- PROTOCOLOS -------------------

  getProtocolos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-protocolos/protocolos-recientes`, {
      headers: this.getAuthHeaders()
    });
  }

  saveProtocolo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/gestion-protocolos/protocolos/completo`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getProtocoloCompletoById(id: string): Observable<Protocolo> {
    return this.http.get<any>(`${this.baseUrl}/gestion-protocolos/protocolos/${id}/completo`, {
      headers: this.getAuthHeaders()
    });
  }

  existeProtocoloPorNombre(nombre: string): Observable<{ nombre: string; existe: boolean }> {
    return this.http.get<{ nombre: string; existe: boolean }>(
      `${this.baseUrl}/gestion-protocolos/protocolos/existe/${encodeURIComponent(nombre)}`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  crearNuevaVersionProtocoloCompleto(dto: any) {
  return this.http.post<any>(
    `${this.baseUrl}/gestion-protocolos/protocolos/completo/nueva-version`,
    dto,
    { headers: this.getAuthHeaders() }
  );
}


  private protocolo: any = null;

  setProtocolo(id: string| null, data: any) {
    this.protocolo = {
      ...data,
      id: id
    };
  }

  getProtocolo() {
    return this.protocolo;
  }

  clearProtocolo() {
    this.protocolo = null;
  }

  desactivarProtocolo(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/gestion-protocolos/protocolos/${id}/desactivar`,
      {}, 
      { headers: this.getAuthHeaders() }
    );
  }

  activarProtocolo(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/gestion-protocolos/protocolos/${id}/activar`,
      {}, 
      {headers: this.getAuthHeaders()}
    );
  }

  // ----------------- VEHICULOS -----------------

  getVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-protocolos/vehiculos`, {
      headers: this.getAuthHeaders()
    });
  }

  // ----------------- CATEGORIA MEDICAMENTO -----------------

  getCategoriasMedicamento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categoria-medicamento`, {
      headers: this.getAuthHeaders()
    });
  }

  // ----------------- MEDICAMENTOS -----------------

  getMedicamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-protocolos/medicamentos`, {
      headers: this.getAuthHeaders()
    });
  }
}
