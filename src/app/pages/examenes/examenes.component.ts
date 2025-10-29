import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component.spec';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../services/gestion-pacientes.service';

@Component({
  selector: 'app-examenes',
  standalone: true,
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class ExamenesComponent {
  constructor(
    private miServicio: GestionPacientesService
  ) {} 

  columnas = [
    { key: 'Nombre', label: 'Nombre' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Protocolo', label: 'Protocolo' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Estado', label: 'Estado', tipo: 'select', opciones: ['Confirmado', 'Reprogramar', 'Precancelado'] },
    { key: 'Observación', label: 'Observación' }
  ];
  datos = [];

  filtro: string = '';
  datosFiltrados = [...this.datos];

  ngOnInit() {
    this.miServicio.getlistadoExamenesPaciente().subscribe({
      next: (res) => {
        console.log('✅ Listado de exámenes del paciente:', res);
        this.datos = res;
        this.datosFiltrados = [...this.datos];
      },
      error: (err) => console.error('❌ Error al obtener listado de exámenes del paciente:', err)
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
}
