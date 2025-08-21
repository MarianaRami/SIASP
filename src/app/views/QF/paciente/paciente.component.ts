import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from '../popup-cambio-protocolo/popup-cambio-protocolo.component';
import { PopupProtocoloComponent } from '../popup-protocolo/popup-protocolo.component';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { PacienteResponseDto } from '../../../models/paciente';
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

  pacienteData!: PacienteResponseDto;

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
    this.cargaDatos()
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

  cargaDatos(){
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

            /*
            if (this.protocolo) {
              console.log('Paciente tiene protocolo, cargando protocolo completo...');
              this.miServicio.getProtocoloCompletoByPaciente(this.cedula) 
                .subscribe({
                  next: (protocoloResp) => {
                    console.log('Protocolo completo desde backend:', protocoloResp);
                    // Aquí puedes guardar la info en una variable de la clase
                    // o actualizar UI según lo que necesites
                  },
                  error: (err) => {
                    console.error('Error al obtener protocolo completo:', err);
                  }
                });
            }
            */
          }
        },
        error: (err) => {
          console.error('Error al obtener paciente:', err);
        }
      });
  }

  onGuardarPaciente(formData: any) {
    const usuario = this.AuthService.getUser();

    // Mapea lo que recibes del servicio al DTO que espera el backend
    const nuevoPacienteDto = {
      idServinte: this.pacienteData.idServinte, 
      nombre1: this.pacienteData.nombre1,
      nombre2: this.pacienteData.nombre2,
      apellido1: this.pacienteData.apellido1,
      apellido2: this.pacienteData.apellido2,
      tipoDocumento: this.pacienteData.tipoDocumento,
      documento: this.pacienteData.documento,
      fechaNacimiento: "1990-05-15T00:00:00.000Z", 
      nombreContacto: "Juan Pérez",
      telefono1: this.pacienteData.telefono1,
      email1: this.pacienteData.email1,
      telefono2: this.pacienteData.telefono2,
      email2: this.pacienteData.email2,
      eps: this.pacienteData.eps,
      estado: "activo",
      indicadores: {
        peso: Number(this.pacienteData.peso), 
        altura: Number(this.pacienteData.altura),
        tfg: Number(this.pacienteData.tfg),
        fecha: "2024-06-07T00:00:00.000Z"
      },
      idProtocolo: formData.idProtocolo, 
      medicoTratante: this.pacienteData.medico_tratante,
      codigoMedicoTratante: this.pacienteData.codigoMedicoTratante,
      codigoEspecialidad: this.pacienteData.codigoEspecialidad,
      fechaConsulta: "2024-06-07T00:00:00.000Z",
      tipo: formData.tipoPaciente,
      razonTratamiento: "nuevo", //formData.razon,
      especialidad: this.pacienteData.especialidad,
      CIE11Descripcion: this.pacienteData.CIE11Descripcion,
      CIE11: this.pacienteData.CIE11,
      tratamiento: this.pacienteData.tratamiento , 
      usuarioCreacion: usuario
    };

    console.log('Enviando paciente nuevo:', nuevoPacienteDto);

    this.miServicio.createPacienteNuevoCompleto(nuevoPacienteDto)
      .subscribe({
        next: (resp) => {
          console.log('Paciente creado correctamente:', resp);
          alert('Paciente guardado con éxito');
          this.cargaDatos();
        },
        error: (err) => {
          console.error('Error al guardar paciente:', err);
          alert('Error al guardar paciente');
        }
      });
  }

}