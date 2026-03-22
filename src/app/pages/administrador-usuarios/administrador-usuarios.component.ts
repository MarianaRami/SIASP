import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionUsuariosService } from '../../services/gestion-usuarios';
import { ModalCrearUsuarios } from '../../views/admin-usuarios/modal-crear-usuarios/modal-crear-usuarios';

@Component({
  selector: 'app-administrador-usuarios',
  templateUrl: './administrador-usuarios.component.html',
  styleUrl: './administrador-usuarios.component.css',
  imports: [
    TablaDinamicaComponent, ModalCrearUsuarios,
    CommonModule, FormsModule
  ]
})
export class AdministradorUsuariosComponent {
  constructor(private usuariosService: GestionUsuariosService) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'rol', label: 'Roles' },
    { key: 'estado', label: 'Estado', tipo: 'select', opciones: ['activo', 'bloqueado', 'inactivo'] }
  ];
  datos: any[] = [];

  filtro: string = '';
  datosFiltrados = [...this.datos];

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe(res => {

      // 🔥 transformar data del backend a tu tabla
      this.datos = res.map((u: any) => ({
        id: u.id,
        nombre: u.nombre,
        cedula: u.nombreUsuario,
        rol: u.roles?.map((r: any) => r.rol.nombreRol).join(', ') || '',
        estado: u.estado
      }));

      this.datosFiltrados = [...this.datos];
    });
  }

  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
      d.cedula.includes(f) || d.nombre.toLowerCase().includes(f)
    );
  }

  onCambioEstado(fila: any) {
    const id = fila.id;
    const estadoAnterior = this.datos.find(d => d.id === id)?.estado;
    const nuevoEstado = fila.estado;

    this.usuariosService.cambiarEstadoUsuario(id, nuevoEstado)
      .subscribe({
        next: () => {
          console.log('✅ Estado actualizado');
        },
        error: () => {
          console.error('❌ Error');
          // rollback si falla
          fila.estado = estadoAnterior;
        }
      });
  }

  mostrarModal = false;

  Agregar() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  recargarUsuarios() {
    this.cargarUsuarios();
  }

  Roles() {

  }
}
