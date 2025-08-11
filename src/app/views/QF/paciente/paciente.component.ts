import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from '../popup-cambio-protocolo/popup-cambio-protocolo.component';
import { PopupProtocoloComponent } from '../popup-protocolo/popup-protocolo.component';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Paciente } from '../../../models/paciente';

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

  pacienteData!: Paciente;

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
            this.pacienteData = resp.data;

            const p = resp.data;

            // Construir el nombre manualmente
            this.paciente = [p.nombre1, p.nombre2, p.apellido1, p.apellido2]
              .filter(Boolean) // Elimina nulos o vacíos
              .join(' ');

            // Construir la identificación manualmente
            this.identificacion = `${p.tipoDocumento?.toUpperCase() || ''}-${p.documento || ''}`;

            this.medico = p.medico_tratante;
            this.protocolo = p.protocolo_actual; // Puede ser null
            this.eps = p.eps;
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

  volver() {
    this.router.navigate(['qf/busqueda'])
  }

  onGuardarPaciente(formData: any) {
    // Construir DTO con info de pacienteData + los nuevos datos
    const nuevoPacienteDto = {
      success: true,
      data: {
        ...this.pacienteData, // datos originales del paciente
        protocolo_actual: formData.protocolo,
        fecha_consulta: formData.fechaConsulta,
        tipoPaciente: formData.tipoPaciente,
        razon: formData.razon,
        fechaInicio: formData.fechaInicio
      }
    };

    console.log('Enviando paciente nuevo:', nuevoPacienteDto);

    this.miServicio.createPacienteNuevoCompleto(nuevoPacienteDto.data)
      .subscribe({
        next: (resp) => {
          console.log('Paciente creado correctamente:', resp);
          alert('Paciente guardado con éxito');
        },
        error: (err) => {
          console.error('Error al guardar paciente:', err);
          alert('Error al guardar paciente');
        }
      });
  }


}