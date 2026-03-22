import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {

  private baseUrl = 'http://localhost:3000/gestion-usuarios';
  private readonly http = inject(HttpClient);

  // ==================== USUARIOS ====================

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  getUsuarioById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/${id}`);
  }

  crearUsuario(dto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios`, dto);
  }

  actualizarUsuario(id: string, dto: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/${id}`, dto);
  }

  cambiarEstadoUsuario(id: string, estado: string) {
    return this.http.patch(
      `${this.baseUrl}/usuarios/${id}/estado`,
      { estado }
    );
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/usuarios/${id}`);
  }

  // ==================== ROLES ====================
  getRoles() {
    return this.http.get<any[]>(`${this.baseUrl}/roles`);
  }

  // asignar rol a usuario
  asignarRolUsuario(dto: any) {
    return this.http.post(`${this.baseUrl}/rol-usuarios`, dto);
  }

}
