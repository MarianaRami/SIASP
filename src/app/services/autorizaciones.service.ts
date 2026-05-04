import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../core/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionesService {
  private readonly api = inject(ApiClient);

  // ------------------- AUTORIZACIONES -------------------

  getPacienteByDocumento(pacienteId: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/autorizaciones/datos/${pacienteId}`);
  }

  getPacienteByDocumentoMeds(pacienteId: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/medicamentos/datos/${pacienteId}`);
  }

  createAutorizacionNueva(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/autorizar-ciclo', dto);
  }
}
