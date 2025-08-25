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

  protocolo: any; 
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
  datos: any[] = [];

  ngOnInit() {
    this.cedula = this.route.snapshot.paramMap.get('cedula') || '';

    this.miServicio.getProtocoloCompletoByPaciente(this.cedula)
      .subscribe({
        next: (resp) => {
          console.log('Protocolo recibido:', resp);
          this.protocolo = resp.nombreProtocolo;

          const ciclo = resp.ciclos?.[0];
          if (ciclo) {
            this.ciclo = ciclo.numCiclo;
            this.fecha_consulta = ciclo.fechaConsulta;
            this.fecha_asignacion = ciclo.fechaIniEstimada;
          }

          this.datos = resp.eventos?.map((evento: any, index: number) => ({
            Aplicacion: index + 1,
            Fecha: `Día ${evento.dia}`,
            Estado: evento.tipo
          })) || [];
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
