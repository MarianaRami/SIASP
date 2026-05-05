import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionUsuariosService } from '../../../services/gestion-usuarios';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-modal-crear-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-crear-usuarios.html',
  styleUrl: './modal-crear-usuarios.css',
})
export class ModalCrearUsuarios implements OnInit {

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  roles: any[] = [];
  rolesSeleccionados: string[] = [];

  usuario: string = ''; 
  nombre: string = '';

  constructor(private usuariosService: GestionUsuariosService) {}

  ngOnInit() {
    this.usuariosService.getRoles().subscribe(res => {
      this.roles = res;
    });
  }

  toggleRol(id: string) {
    if (this.rolesSeleccionados.includes(id)) {
      this.rolesSeleccionados = this.rolesSeleccionados.filter(r => r !== id);
    } else {
      this.rolesSeleccionados.push(id);
    }
  }

  guardar() {
    if (!this.usuario || !this.nombre) {
      alert('Debes llenar todos los campos');
      return;
    }

    if (this.rolesSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un rol');
      return;
    }

    const fecha = new Date().toISOString().split('T')[0];

    // 🔹 1. CREAR USUARIO
    this.usuariosService.crearUsuario({
      nombreUsuario: this.usuario,
      nombre: this.nombre,
      estado: 'activo'
    })
    .pipe(

      // 🔹 2. CUANDO SE CREA → ASIGNAR ROLES
      switchMap((usuarioCreado: any) => {

        const idUsuario = usuarioCreado.id;

        if (!idUsuario) {
          console.error('❌ No vino el id del usuario');
          return of(null);
        }

        const peticiones = this.rolesSeleccionados.map((idRol: string) =>
          this.usuariosService.asignarRolUsuario({
            id_usuario: idUsuario,
            id_rol: idRol,
            fechaAsignacion: fecha,
            estado: 'activo'
          })
        );

        return forkJoin(peticiones);
      })

    )
    .subscribe({
      next: () => {
        console.log('✅ Usuario creado con roles');
        this.guardado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        console.error('❌ Error creando usuario con roles', err);
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
