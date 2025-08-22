import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { PopUpMedicamentosComponent } from '../pop-up-medicamentos/pop-up-medicamentos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';

@Component({
  selector: 'app-configuracion-ciclo',
  imports: [
    TablaDinamicaComponent, PopUpMedicamentosComponent,
    FormsModule, CommonModule
  ],
  templateUrl: './configuracion-ciclo.component.html',
  styleUrl: './configuracion-ciclo.component.css'
})
export class ConfiguracionCicloComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private miServicio: GestionPacientesService
  ) {}

  mostrarPopup = false;
  cedula!: string;

  protocolo: any; // aquí luego tipamos
  ciclo = '';
  fecha_asignacion = '';
  fecha_consulta = '';
  cie10 = '';
  peso = '';
  superficie = '';
  tfg = '';
  conf_medicamentos: '' | undefined;

  columnas = [
    { key: 'Aplicacion', label: 'No. Aplicación' },
    { key: 'Fecha', label: 'Fecha programada' },
    { key: 'Estado', label: 'Estado' }
  ];
  datos = [];

  ngOnInit() {
    // 1. Tomar la cédula de la URL
    this.cedula = this.route.snapshot.paramMap.get('cedula') || '';

    // 2. Llamar a tu servicio con la cédula
    this.miServicio.getProtocoloCompletoByPaciente(this.cedula)
      .subscribe({
        next: (resp) => {
          console.log('Protocolo recibido:', resp);
          this.protocolo = resp; // Guardar los datos para usarlos
        },
        error: (err) => {
          console.error('Error obteniendo protocolo:', err);
        }
      });
  }

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  volver() {
    this.router.navigate(['qf/busqueda/paciente', this.cedula])
  }
}

