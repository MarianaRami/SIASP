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
  private user: string | null = null;

  private readonly http = inject(HttpClient);

  // ------------------- PROTOCOLOS -------------------

  getProtocolos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-protocolos/protocolos-recientes`);
  }

  saveProtocolo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/gestion-protocolos/protocolos/completo`, data);
  }

  getProtocoloCompletoById(id: string): Observable<Protocolo> {
    return this.http.get<any>(`${this.baseUrl}/gestion-protocolos/protocolos/${id}/completo`);
  }

  existeProtocoloPorNombre(nombre: string): Observable<{ nombre: string; existe: boolean }> {
    return this.http.get<{ nombre: string; existe: boolean }>(
      `${this.baseUrl}/gestion-protocolos/protocolos/existe/${encodeURIComponent(nombre)}`
    );
  }

  crearNuevaVersionProtocoloCompleto(dto: any) {
  return this.http.post<any>(
    `${this.baseUrl}/gestion-protocolos/protocolos/completo/nueva-version`,
    dto);
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
      {}
    );
  }

  activarProtocolo(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/gestion-protocolos/protocolos/${id}/activar`,
      {}
    );
  }

  // ----------------- VEHICULOS -----------------

  getVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-protocolos/vehiculos`);
  }

  // ----------------- CATEGORIA MEDICAMENTO -----------------

  getCategoriasMedicamento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categoria-medicamento`);
  }

  // ----------------- MEDICAMENTOS -----------------

  getMedicamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gestion-protocolos/medicamentos`);
  }
}
