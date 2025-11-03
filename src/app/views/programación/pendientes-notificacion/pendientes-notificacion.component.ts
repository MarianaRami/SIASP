import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramacionService } from '../../../services/programacion.service';

interface PacienteNotif {
  nombre: string;
  cedula: string;
  telefonos: string;
  fecha: string;
  idCicloPaciente: string;
  idEventoPaciente: string;
}

@Component({
  selector: 'app-pendientes-notificacion',
  templateUrl: './pendientes-notificacion.component.html',
  styleUrl: './pendientes-notificacion.component.css',
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class PendientesNotificacionComponent {
  constructor( 
    private router: Router,
    private programacionServicio: ProgramacionService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'telefonos', label: 'Teléfono' },
    { key: 'fecha', label: 'Fecha Aplicación' },
    { key: 'Boton', label: ' ', tipo: 'button'}
  ];
  datos: PacienteNotif[] = [];

  filtro: string = '';
  datosFiltrados = [...this.datos];

  ngOnInit() {
    this.programacionServicio.getlistadoPacientesNotificacion().subscribe({
      next: (res) => {
        console.log('✅ Pacientes pendientes de notificación:', res);
        this.datos = res.pacientesNotif.map((p: any) => ({
          ...p,
          fecha: this.formatearFecha(p.fecha)
        }));
        this.datosFiltrados = [...this.datos];
      },
      error: (err) => console.error('❌ Error al obtener pacientes pendientes de notificación:', err)
    });
  }

  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();

    this.datosFiltrados = this.datos.filter(d => {
      const cedula = (d.cedula || '').toString().toLowerCase();
      const nombre = (d.nombre || '').toLowerCase();
      return cedula.includes(f) || nombre.includes(f);
    });
  }


  handleBuscar(fila: any) {
    console.log('Cédula recibida:', fila.cedula);  
    this.router.navigate(['/programacion/busquedaPro/historial', fila.cedula ]);
  }

  volver() {
    this.router.navigate(['programacion'])
  }
}
