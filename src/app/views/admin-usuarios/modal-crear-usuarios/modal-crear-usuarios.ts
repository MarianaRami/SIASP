import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionUsuariosService } from '../../../services/gestion-usuarios';

@Component({
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

    const fecha = new Date().toISOString().split('T')[0];

    const requests = this.rolesSeleccionados.map(idRol => {
      return this.usuariosService.crearUsuario({
        nombreUsuario: this.usuario,
        nombre: this.nombre,
        id_rol: idRol,

        
        //id_usuario: this.idUsuario,
        //fechaAsignacion: fecha,
        //estado: 'activo'
      });
    });

    // 🔥 ejecutar todos los requests
    Promise.all(requests.map(r => r.toPromise()))
      .then(() => {
        console.log('✅ Roles asignados');
        this.guardado.emit();
        this.cerrar.emit();
      })
      .catch(() => {
        console.error('❌ Error asignando roles');
      });
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
