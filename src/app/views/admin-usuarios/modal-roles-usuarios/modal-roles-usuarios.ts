import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionUsuariosService } from '../../../services/gestion-usuarios';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-modal-roles-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-roles-usuarios.html',
  styleUrl: './modal-roles-usuarios.css',
})
export class ModalRolesUsuarios {
  @Input() usuario: any;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  rolesSeleccionados: string[] = [];
  rolesDisponibles: any[] = [];
  cargando = false;

  constructor(private usuariosService: GestionUsuariosService) {}

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.usuariosService.getRoles().subscribe({
      next: (roles) => {
        this.rolesDisponibles = roles;
        this.rolesSeleccionados = this.usuario.rolesDetalle.map((r: any) => r.rol.id) || [];
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
      }
    });
  }

  estaSeleccionado(id: string): boolean {
    return this.rolesSeleccionados.includes(id);
  }

  toggleRol(idRol: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    
    if (checked) {
      if(!this.rolesSeleccionados.includes(idRol)) 
      this.rolesSeleccionados.push(idRol);

    } else {
      this.rolesSeleccionados = this.rolesSeleccionados.filter(r => r !== idRol);
    }
  }

  guardarCambios() {
    const rolesActuales: string[] = this.usuario.rolesDetalle.map(
      (r: any) => r.rol.id
    ) || [];

    // 🔹 NUEVOS (no estaban antes)
    const rolesNuevos = this.rolesSeleccionados.filter(
      id => !rolesActuales.includes(id)
    );

    // 🔹 ELIMINADOS (ya no están seleccionados)
    const rolesEliminados = rolesActuales.filter(
      id => !this.rolesSeleccionados.includes(id)
    );

    // 🔥 si no hay cambios
    if (rolesNuevos.length === 0 && rolesEliminados.length === 0) {
      this.cerrar.emit();
      return;
    }

    this.cargando = true;

    const fechaHoy = this.formatearFecha(new Date());

   const peticiones = [] as Observable<any>[];

    // ✅ AGREGAR roles nuevos
    rolesNuevos.forEach(idRol => {
      peticiones.push(
        this.usuariosService.asignarRolUsuario({
          id_usuario: this.usuario.id,
          id_rol: idRol,
          fechaAsignacion: fechaHoy,
          estado: 'Activo'
        })
      );
    });

    // ❌ DESACTIVAR roles eliminados
    rolesEliminados.forEach((idRol: string) => {
      peticiones.push(
        this.usuariosService.asignarRolUsuario({
          id_usuario: this.usuario.id,
          id_rol: idRol,
          fechaAsignacion: fechaHoy,
          estado: 'Inactivo' // 🔥 clave
        })
      );
    });

    forkJoin(peticiones).subscribe({
      next: () => {
        console.log('✅ Roles sincronizados');
        this.guardado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        console.error('❌ Error al actualizar roles', err);
        this.cargando = false;
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
