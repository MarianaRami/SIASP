import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Protocolo } from '../models/protocolo.model';
import { ApiClient } from '../core/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolosService {
  private readonly api = inject(ApiClient);

  // ------------------- PROTOCOLOS -------------------

  getProtocolos(): Observable<any[]> {
    return this.api.get<any[]>('/gestion-protocolos/protocolos-recientes');
  }

  saveProtocolo(data: any): Observable<any> {
    return this.api.post<any>('/gestion-protocolos/protocolos/completo', data);
  }

  getProtocoloCompletoById(id: string): Observable<Protocolo> {
    return this.api.get<Protocolo>(`/gestion-protocolos/protocolos/${id}/completo`);
  }

  existeProtocoloPorNombre(nombre: string): Observable<{ nombre: string; existe: boolean }> {
    return this.api.get<{ nombre: string; existe: boolean }>(
      `/gestion-protocolos/protocolos/existe/${encodeURIComponent(nombre)}`
    );
  }

  crearNuevaVersionProtocoloCompleto(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-protocolos/protocolos/completo/nueva-version', dto);
  }

  desactivarProtocolo(id: string): Observable<any> {
    return this.api.patch<any>(`/gestion-protocolos/protocolos/${id}/desactivar`, {});
  }

  activarProtocolo(id: string): Observable<any> {
    return this.api.patch<any>(`/gestion-protocolos/protocolos/${id}/activar`, {});
  }

  // ------------------- ESTADO LOCAL DE PROTOCOLO -------------------

  private protocolo: any = null;

  setProtocolo(id: string | null, data: any) {
    this.protocolo = { ...data, id };
  }

  getProtocolo() {
    return this.protocolo;
  }

  clearProtocolo() {
    this.protocolo = null;
  }

  // ------------------- VEHICULOS -------------------

  getVehiculos(): Observable<any[]> {
    return this.api.get<any[]>('/gestion-protocolos/vehiculos');
  }

  // ------------------- CATEGORIA MEDICAMENTO -------------------

  getCategoriasMedicamento(): Observable<any[]> {
    return this.api.get<any[]>('/categoria-medicamento');
  }

  // ------------------- MEDICAMENTOS -------------------

  getMedicamentos(): Observable<any[]> {
    return this.api.get<any[]>('/gestion-protocolos/medicamentos');
  }
}
