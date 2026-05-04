import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PacienteResponse, DescripcionCicloPacienteCompletoResponse } from '../models/paciente';
import { MedicamentoParaPresentacionDto } from '../models/descripcion-medicamentos';
import { ApiClient } from '../core/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class GestionPacientesService {
  private readonly api = inject(ApiClient);

  // ------------------- PACIENTES -------------------

  getPacienteCompletoByDocumento(documento: string): Observable<PacienteResponse> {
    return this.api.get<PacienteResponse>(`/gestion-pacientes/pacientes/documento/${documento}`);
  }

  createPacienteNuevoCompleto(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/nuevo-paciente/', dto);
  }

  asignarNuevoProtocoloPaciente(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/asignar-protocolo/', dto);
  }

  // ------------------- Medicamentos Presentación -------------------

  createPacienteMedicamentoPresentacion(dto: MedicamentoParaPresentacionDto): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/pacientes/medicamentos-presentacion', dto);
  }

  // ------------------- CREACIÓN DE CICLO -------------------

  createCicloPaciente(dto: any): Observable<DescripcionCicloPacienteCompletoResponse> {
    return this.api.post<DescripcionCicloPacienteCompletoResponse>('/gestion-pacientes/pacientes/ciclo-paciente', dto);
  }

  // ------------------- PACIENTES CON OBSERVACION -------------------

  getPacientesConObservacion(): Observable<any> {
    return this.api.get<any>('/gestion-pacientes/pacientes-revision');
  }

  // ------------------- EXAMENES -------------------

  getlistadoExamenesPaciente(fecha: Date): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/pacientes-revision-examenes/${fecha.toISOString()}`);
  }

  asignarRevisionExamenesCiclo(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/revision-examenes-ciclo', dto);
  }

  // ------------------- ENFERMERIA -------------------

  getlistadoEnfermeriaPaciente(fecha: string, tipoPaciente?: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/pacientes-aplicacion/${fecha}/${tipoPaciente || 'ambulatorio'}`);
  }

  postregistrarAsistencias(dto: any): Observable<any> {
    return this.api.post<any>('/gestion-pacientes/confirmacion-aplicacion', dto);
  }

  // ------------------- JEFE DE ENFERMERIA -------------------

  getDatosOP(): Observable<any> {
    return this.api.get<any>('/gestion-pacientes/datos-op');
  }

  getDatosFarmacia(): Observable<any> {
    return this.api.get<any>('/gestion-pacientes/datos-farmacia');
  }

  // ------------------- FARMACIA -------------------

  getOrdenesFarmacia(fecha: string, tipoPaciente: string, tipoOrden: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/ordenes-farmacia/${fecha}/${tipoPaciente}/${tipoOrden}`);
  }

  // ------------------- DIRECTOR FARMACIA -------------------

  getProyeccionMedicamentos(desde: string, hasta: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/reporte-farmacia/${desde}/${hasta}/OP`);
  }

  getProyeccionMedicamentosPorDia(desde: string, hasta: string): Observable<any> {
    return this.api.get<any>(`/gestion-pacientes/reporte-farmacia-por-dia/${desde}/${hasta}/OP`);
  }

  // ------------------- INDICADORES -------------------

  getErroresMedicamentosGet(fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.api.get<any[]>(`/gestion-pacientes/reporte-errores-medicamentos/${fechaIni}/${fechaFin}`);
  }

  getAuditoriaPacienteGet(documento: string, fechaIni: string, fechaFin: string): Observable<any[]> {
    return this.api.get<any[]>(`/gestion-pacientes/reporte-auditoria-paciente/${documento}/${fechaIni}/${fechaFin}`);
  }
}
