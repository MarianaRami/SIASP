import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteResponse, DescripcionCicloPacienteCompleto, DescripcionCicloPacienteCompletoResponse } from '../models/paciente';
import { MedicamentoParaPresentacionDto } from '../models/descripcion-medicamentos';

@Injectable({
  providedIn: 'root'
})
export class GestionPacientesService {
  private apiUrl = 'http://localhost:3000/gestion-pacientes'; // ajusta a tu URL real

  constructor(private http: HttpClient) {}


  // ------------------- PACIENTES -------------------

  getPacienteCompletoByDocumento(documento: string): Observable<PacienteResponse> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes/documento/${documento}`
    );
  }

  createPacienteNuevoCompleto(dto: any) {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/nuevo-paciente/`, dto
    );
  }

  asignarNuevoProtocoloPaciente(dto: any) {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/asignar-protocolo/`,
      dto
    );
  }

  // ------------------- Medicamentos Presentación -------------------
  createPacienteMedicamentoPresentacion(
    dto: MedicamentoParaPresentacionDto
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/pacientes/medicamentos-presentacion`,
      dto
    );
  }

  // ------------------- CREACIÓN DE CICLO -------------------
  // crea tanto el ciclo en estado activo como borrador
  createCicloPaciente(dto: DescripcionCicloPacienteCompleto): Observable<DescripcionCicloPacienteCompletoResponse> {
    return this.http.post<DescripcionCicloPacienteCompletoResponse>(
      `${this.apiUrl}/pacientes/ciclo-paciente`,
      dto
    );
  }

  // ------------------- PACIENTES CON OBSERVACION -------------------
  getPacientesConObservacion(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-revision`
    );
  }

  // ------------------- EXAMENES -------------------
  getlistadoExamenesPaciente(fecha: Date): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-revision-examenes/${fecha.toISOString()}`
    );
  }

  asignarRevisionExamenesCiclo(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/revision-examenes-ciclo`,
      dto
    );
  }

  // ------------------- ENFERMERIA -------------------
  getlistadoEnfermeriaPaciente(fecha: string, tipoPaciente?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/pacientes-aplicacion/${fecha}/${tipoPaciente || 'ambulatorio'}`
    );
  }

  postregistrarAsistencias(dto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/confirmacion-aplicacion`,
      dto
    );
  }

  // ------------------- JEFE DE ENFERMERIA -------------------
  getDatosOP(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/datos-op`
    );
  }

  getDatosFarmacia(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/datos-farmacia`
    );
  }

  // ------------------- FARMACIA -------------------
  getOrdenesFarmacia(
  fecha: string,
  tipoPaciente: string,
  tipoOrden: string
) {
  return this.http.get<any>(
    `${this.apiUrl}/ordenes-farmacia/${fecha}/${tipoPaciente}/${tipoOrden}`
  );
}

}

