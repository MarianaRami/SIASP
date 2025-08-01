import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // ------------------- AUTH -------------------

  login(nombreUsuario: string): Observable<any> {
    const body = { nombreUsuario };
    return this.http.post(`${this.baseUrl}/auth/login`, body);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('jwtToken');
    }
    return this.token;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // ------------------- PROTOCOLOS -------------------

  getProtocolos(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`
    });

    return this.http.get<any[]>(`${this.baseUrl}/gestion-protocolos/protocolos`, { headers });
  }

  saveProtocolo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/gestion-protocolos/protocolos/completo`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getProtocoloCompletoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/gestion-protocolos/protocolos/${id}/completo`, {
      headers: this.getAuthHeaders()
    });
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
