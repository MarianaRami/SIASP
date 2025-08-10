import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from '../popup-cambio-protocolo/popup-cambio-protocolo.component';
import { PopupProtocoloComponent } from '../popup-protocolo/popup-protocolo.component';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';

@Component({
  selector: 'app-paciente',
  imports: [
    PopupCambioProtocoloComponent, PopupProtocoloComponent, TablaDinamicaComponent,
    FormsModule,CommonModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
  constructor(
    private route: ActivatedRoute,
    private miServicio: GestionPacientesService,
    private router: Router
  ) {}

  mostrarPopup = false;
  mostrarPopupPr = false;
  cedula!: string;
  paciente = '';
  identificacion = '';
  medico = '';
  protocolo = '';
  eps = '';
  cie10 = '';
  especialidad = '';

  ngOnInit() {
    this.cedula = this.route.snapshot.paramMap.get('cedula') || '';
    
    this.miServicio.getPacienteCompletoByDocumento(this.cedula)
      .subscribe({
        next: (resp) => {
          console.log('Paciente desde backend:', resp);

          if (resp.success && resp.data) {
            const p = resp.data;
            this.paciente = p.nombre_completo;
            this.identificacion = p.identificacion;
            this.medico = p.medico_tratante;
            this.protocolo = p.protocolo_actual; // Puede ser null
            this.eps = p.eps;
            this.cie10 = p.CIE11_descripcion;
            this.especialidad = p.especialidad;
          }
        },
        error: (err) => {
          console.error('Error al obtener paciente:', err);
        }
      });
  }

  columnas = [
    { key: 'Ciclo', label: 'Ciclo' },
    { key: 'Estado', label: 'Estado' },
    { key: 'Fecha', label: 'Fecha Finalización' }
  ];
  datos = [
    { Ciclo: '1', Estado: 'Activo', Fecha: '01/08/2024' },
    { Ciclo: '2', Estado: 'Activo', Fecha: '01/09/2025' }
  ];

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  abrirPopupPr() {
    this.mostrarPopupPr = true;
  }

  cerrarPopupPr() {
    this.mostrarPopupPr = false;
  }

  anadirCiclo() {
    this.router.navigate(['qf/busqueda/paciente/protocolo'])
  }

  editar() {
    this.router.navigate(['qf/busqueda/paciente/cambio_protocolo'])
  }

  volver() {
    this.router.navigate(['qf/busqueda'])
  }

}