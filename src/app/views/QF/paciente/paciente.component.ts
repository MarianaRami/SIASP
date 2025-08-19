import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from '../popup-cambio-protocolo/popup-cambio-protocolo.component';
import { PopupProtocoloComponent } from '../popup-protocolo/popup-protocolo.component';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Paciente } from '../../../models/paciente';
import { AuthService } from '../../../services/auth.service';

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
    private AuthService: AuthService,
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

  configurarCiclo() {
    this.router.navigate(['qf/busqueda/paciente',this.cedula, 'conf-ciclo'])
  }

  volver() {
    this.router.navigate(['qf/busqueda'])
  }

  onGuardarPaciente(formData: any) {
    const usuario = this.AuthService.getUser();
    // Construir DTO con info de pacienteData + los nuevos datos
    const nuevoPacienteDto = {
      success: true,
      data: {
        idPacienteServinte: "1838fc29-1e14-4e56-8d7e-d8e1d7ac7841",
        nombre1: this.pacienteData.nombre1,
        nombre2: this.pacienteData.nombre2,
        apellido1: this.pacienteData.apellido1,
        apellido2: this.pacienteData.apellido2,
        tipoDocumento: this.pacienteData.tipoDocumento,
        documento: this.pacienteData.documento,
        fechaNacimiento: "1990-05-15T00:00:00.000Z",
        nombreContacto: "Juan Pérez",
        telefono1: "3001234567",
        email1 : "ana.martinez@email.com",
        telefono2: "3109876543",
        email2 : "contacto.secundario@email.com",
        eps: this.pacienteData.eps,
        estado: "activo",
        indicadores: {
          peso: this.pacienteData.peso,
          altura: this.pacienteData.altura,
          tfg: this.pacienteData.tfg,
          fecha: "2024-06-07T00:00:00.000Z"
        },
        idProtocolo: "7d900dd0-6caa-4782-8947-a35e3adca6b2",
        medicoTratante: this.pacienteData.medico_tratante,
        codigoMedicoTratante: 15,
        codigoEspecialidad: 15,
        fechaConsulta: "2024-06-07T00:00:00.000Z",
        tipo: formData.tipoPaciente,
        razonTratamiento: formData.razon,
        especialidad: this.pacienteData.especialidad,
        CIE11Descripcion: this.pacienteData.CIE11Descripcion,
        CIE11: this.pacienteData.CIE11,
        tratamiento: "Quimioterapia",
        codigoTratamiento: 1,
        usuarioCreacion: "edd4153e-3594-496a-9165-cec3d4e46234"
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