import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramacionService } from '../../../services/programacion.service';

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
    { key: 'Boton', label: ' ', tipo: 'checkbox'}
  ];
  datos = [ ];

  filtro: string = '';
  datosFiltrados = [...this.datos];

  ngOnInit() {
    this.programacionServicio.getlistadoPacientesNotificacion().subscribe({
      next: (res) => {
        console.log('✅ Pacientes pendientes de notificación:', res);
        this.datos = res;
        this.datosFiltrados = [...this.datos];
      },
      error: (err) => console.error('❌ Error al obtener pacientes pendientes de notificación:', err)
    });
  }

  filtrarDatos() {
    /*
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
      d.Cedula.includes(f) || d.Nombre.toLowerCase().includes(f)
    );
    */
  }

  handleBuscar(fila: any) {
    console.log('Cédula recibida:', fila.Cedula);  
    this.router.navigate(['/programacion/busquedaPro/historial']);
  }

  volver() {
    this.router.navigate(['programacion'])
  }
}
