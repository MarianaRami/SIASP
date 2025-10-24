import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';


@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrl: './observaciones.component.css',
  imports: [
    TablaDinamicaComponent, 
    CommonModule, FormsModule
  ],
})
export class ObservacionesComponent {
  constructor(
    private router: Router,
    private gestionPacientesService: GestionPacientesService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'observacion', label: 'Observación' },
    { key: 'boton', label: '', tipo: 'button' },
  ];
  datos = [];

  // getPacientesConObservacion()
  ngOnInit() {
    this.gestionPacientesService.getPacientesConObservacion().subscribe({
      next: (res) => {
        console.log('✅ Pacientes con observación:', res);
        this.datos = res.pacientesObs;
      },
      error: (err) => console.error('❌ Error al obtener pacientes con observación:', err)
    });
  }

  handleBuscar(fila: any) {
    console.log('Cédula recibida:', fila.cedula);  
    this.router.navigate(['qf/busqueda/paciente', fila.cedula , 'conf-ciclo']);
  }
}
