import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';
import { ProgramacionService } from '../../../services/programacion.service';


@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css',
  imports: [
      TablaDinamicaComponent,
      CommonModule, FormsModule
    ]
})
export class ConfirmacionComponent {
  constructor(
    private router: Router,
    private programacionServicio: ProgramacionService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'telefonos', label: 'Telefono' },
    { key: 'Estado', label: 'Estado', tipo: 'select', opciones: ['Confirmado', 'Reprogramar'] },
    { key: 'Observaciones', label: 'Observaciones', tipo: 'text' },
  ];
  datos = [];

  ngOnInit() {
    this.programacionServicio.getlistadoPacientesConfirmacion().subscribe({
      next: (res) => {
        console.log('✅ Pacientes para confirmación:', res);
        this.datos = res.pacientesConf;
        this.datosFiltrados = [...this.datos];
      },
      error: (err) => console.error('❌ Error al obtener pacientes para confirmación:', err)
    });
  }

  filtro: string = '';
  datosFiltrados = [...this.datos];

  filtrarDatos() {
    /*
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
      d.Cedula.includes(f) || d.Nombre.toLowerCase().includes(f)
    );
    */
  }

  volver() {
    this.router.navigate(['programacion/menuConfirmacion'])
  }

}
