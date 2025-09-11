import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from '../popup-cambio-protocolo/popup-cambio-protocolo.component';
import { PopupProtocoloComponent } from '../popup-protocolo/popup-protocolo.component';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { PacienteResponseDto, CreateProtocoloPacienteCompletoDto } from '../../../models/paciente';
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
  version = '';

  protocoloCompleto: any = null; 
  ciclos: any[] = [];

  ngOnInit() {
    this.cargaDatos()
  }

  columnas = [
    { key: 'ciclo', label: 'Ciclo' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaFinEstimada', label: 'Fecha Finalización' }
  ];
  datos: { ciclo: any; estado: string; fechaFinEstimada: any }[] = [];

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

            // ahora el backend ya trae nombre completo y identificacion
            this.paciente = this.pacienteData.nombreCompleto;
            this.identificacion = this.pacienteData.identificacion;
            this.medico = this.pacienteData.medicoTratante;
            this.protocolo = this.pacienteData.protocoloActual?.nombreProtocolo || '';
            this.eps = this.pacienteData.eps;
            this.especialidad = this.pacienteData.especialidad;
            this.cie10 = this.pacienteData.CIE11Descripcion

            
            if (this.protocolo) {
              console.log('Paciente tiene protocolo, cargando protocolo completo...');
              this.miServicio.getProtocoloCompletoByPaciente(this.cedula) 
                .subscribe({
                  next: (protocoloResp) => {
                    console.log('Protocolo completo desde backend:', protocoloResp);
                    this.protocoloCompleto = protocoloResp;
                    this.version = protocoloResp.version;
                    this.ciclos = protocoloResp.ciclos || [];

                    // Aquí transformas los ciclos para la tabla
                    this.datos = (this.ciclos || []).map((ciclo: any) => ({
                      ciclo: ciclo.numCiclo,
                      estado: ciclo.fechaFinReal ? 'Inactivo' : 'Activo',
                      fechaFinEstimada: ciclo.fechaFinReal || '-'
                    }));
                  },
                  error: (err) => {
                    console.error('Error al obtener protocolo completo:', err);
                  }
                });
            }
            
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
      fechaNacimiento: this.pacienteData.fechaNacimiento, 
      nombreContacto: this.pacienteData.nombreContacto,
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
        fecha: formData.fechaInicio
      },
      idProtocolo: formData.idProtocolo, 
      medicoTratante: this.pacienteData.medicoTratante,
      codigoMedicoTratante: this.pacienteData.codigoMedicoTratante,
      codigoEspecialidad: this.pacienteData.codigoEspecialidad,
      fechaConsulta: formData.fechaConsulta,
      tipo: formData.tipoPaciente,
      razonTratamiento: formData.razon,
      especialidad: this.pacienteData.especialidad,
      CIE11Descripcion: this.pacienteData.CIE11Descripcion,
      CIE11: this.pacienteData.CIE11,
      tratamientoNombre: formData.tratamiento , 
      tratamientoTipo: formData.tipoTratamiento ,
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

  guardarCambio(formData: any) {
    const usuario = this.AuthService.getUser();

      const dto: CreateProtocoloPacienteCompletoDto = {
        idProtocolo: formData.idProtocolo,
        idPaciente: this.pacienteData.idPaciente,
        idServinte: this.pacienteData.idServinte,
        usuarioCreacion: usuario,
        documento: this.pacienteData.documento,
        tipoDocumento: this.pacienteData.tipoDocumento,
        fechaRegistroProtocolo: formData.fechaInicio,
        estado: "activo",
        tipo: formData.tipoPaciente,
        razonTratamiento: formData.razon,
        fechaConsulta: formData.fechaConsulta,
        CIE11Descripcion: this.pacienteData.CIE11Descripcion,
        CIE11: this.pacienteData.CIE11,
        medicoTratante: this.pacienteData.medicoTratante,
        codigoMedicoTratante: this.pacienteData.codigoMedicoTratante,
        especialidad: this.pacienteData.especialidad,
        codigoEspecialidad: this.pacienteData.codigoEspecialidad,
        tratamiento: formData.tratamiento , 
        tipoTratamiento: formData.tipoTratamiento 
      };

      console.log('Enviando paciente nuevo:', dto);

      this.miServicio.asignarNuevoProtocoloPaciente(dto).subscribe({
        next: (resp) => {
          console.log("✅ Protocolo asignado:", resp);
          alert("Protocolo actualizado con éxito");
          this.cargaDatos();
        },
        error: (err) => {
          console.error("❌ Error asignando protocolo:", err);
          alert("Error al asignar protocolo");
        }
      });
  }

}