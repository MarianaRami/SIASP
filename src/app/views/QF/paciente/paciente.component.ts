import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupCambioProtocoloComponent } from '../popup-cambio-protocolo/popup-cambio-protocolo.component';
import { PopupProtocoloComponent } from '../popup-protocolo/popup-protocolo.component';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { ProtocoloActualDto, PacienteResponseDto, CicloDto, CreateProtocoloPacienteCompletoDto } from '../../../models/paciente';
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
  nombreEspecialidad = '';
  version = '';

  protocoloCompleto!: CicloDto | null; 
  ciclos: any[] = [];

  protocoloActual!: ProtocoloActualDto | null;

  mensajeError: string = '';

  diagnosticos: any[] = [];
  cieSeleccionado: string = '';

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

  construirNombreCompleto(registro: any): string {
    const partes = [
      registro.nombres,
      registro.apellidos,
    ].filter(parte => parte && parte.trim() !== '');
    
    return partes.join(' ');
  }

  construirIdentificacionCompleta(registro: any): string {
    const partes = [
      registro.tipoDocumento,
      registro.documento,
    ].filter(parte => parte && parte.trim() !== '');
    
    return partes.join('-');
  }

  construirEspecialidadCompleta(diagnostico: any): string {
    const partes = [
      String(diagnostico.codigoEspecialidad),
      diagnostico.nombreEspecialidad,
    ].filter(parte => parte && parte.trim() !== '');
    
    return partes.join('-');
  }

  construirCIE11Completa(diagnostico: any): string {
    const partes = [
      diagnostico.codigo,
      diagnostico.descripcion,
    ].filter(parte => parte && parte.trim() !== '');
    
    return partes.join('-');
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

            if (p.protocolosActuales && p.protocolosActuales.length > 0) {
              this.protocoloActual = p.protocolosActuales[0];
            } else {
              this.protocoloActual = null;
            }

            // ahora el backend ya trae nombre completo y identificacion
            this.paciente = this.construirNombreCompleto(this.pacienteData);
            this.identificacion = this.construirIdentificacionCompleta(this.pacienteData);
            this.medico = this.protocoloActual?.medicoTratante || '';
            this.protocolo = this.protocoloActual?.nombreProtocolo || '';
            this.eps = this.pacienteData.eps;
            this.diagnosticos = this.pacienteData.diagnosticos && this.pacienteData.diagnosticos.length > 0 ? this.pacienteData.diagnosticos : [];

            if (this.diagnosticos.length > 0) {
              this.cie10=this.construirCIE11Completa(this.diagnosticos[0])
              this.cieSeleccionado = this.diagnosticos[0].descripcion;
              this.especialidad = this.construirEspecialidadCompleta(this.diagnosticos[0]);
              this.nombreEspecialidad = this.diagnosticos[0].nombreEspecialidad;
            }else{
              if(this.protocoloActual){
                this.especialidad = this.protocoloActual.nombreEspecialidad || '';
                this.nombreEspecialidad = this.protocoloActual.nombreEspecialidad || '';
              }
            }
          
            this.ciclos = this.protocoloActual?.ciclos || [];  

            if (this.protocolo) {
              // Aquí transformas los ciclos para la tabla
              this.datos = (this.ciclos || []).map((ciclo: any) => ({
                ciclo: ciclo.numCiclo,
                estado: this.formatearEstado(ciclo.estado),
                fechaFinEstimada: ciclo.fechaFinReal || '-'
              }));
            }
          }
        },
        error: (err) => {
          console.error('Error al obtener paciente:', err);

          if (err.status === 404) {
            this.mensajeError = err.error?.message || 'Paciente no encontrado';
            alert(this.mensajeError);
            this.router.navigate(['qf/busqueda']);
          } else {
            this.mensajeError = 'Ocurrió un error inesperado al buscar el paciente.';
          }
        }
      });
  }

  onGuardarPaciente(formData: any) {
    const usuario = this.AuthService.getUser();

    let CIE11Descripcion = '';
    let CIE11 = '';
    let codigoEspecialidad = '';
    let nombreEspecialidad = '';

    if (this.diagnosticos.length > 0) {
      CIE11=this.diagnosticos[0].codigo;
      CIE11Descripcion = this.diagnosticos[0].descripcion;
      codigoEspecialidad = this.diagnosticos[0].codigoEspecialidad;
      nombreEspecialidad = this.diagnosticos[0].nombreEspecialidad;
    }


    // Mapea lo que recibes del servicio al DTO que espera el backend
    const nuevoPacienteDto = {
      idServinte: this.pacienteData.idServinte,
      nombres: this.pacienteData.nombres,
      apellidos: this.pacienteData.apellidos, 
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
        talla: Number(this.pacienteData.talla),
        tfg: Number(this.pacienteData.tfg),
        fecha: formData.fechaInicio
      },
      diagnosticos: this.diagnosticos.map(d => ({
        codigo: d.codigo,
        descripcion: d.descripcion,
        codigoEspecialidad: d.codigoEspecialidad,
        nombreEspecialidad: d.nombreEspecialidad
      })),
      idProtocolo: formData.idProtocolo, 
      codigoEspecialidad: codigoEspecialidad,
      fechaConsulta: formData.fechaConsulta,
      tipo: formData.tipoPaciente,
      razonTratamiento: formData.razon,
      nombreEspecialidad: nombreEspecialidad,
      // CIE11Descripcion: CIE11Descripcion,
      // CIE11: CIE11,
      // tratamientoNombre: formData.tratamiento , 
      // tratamientoTipo: formData.tipoTratamiento ,
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

  formatearEstado(estado: string): string {
    const estadosMap: Record<string, string> = {
      borrador: 'Borrador',
      autorizado: 'Autorizado',
      activo: 'Activo',
      suspendido: 'Suspendido',
      finalizado: 'Finalizado',
      revision: 'Revisión',
      notificado: 'Notificado',
      programado: 'Programado',
      revisado_examenes: 'Revisado Exámenes'
    };

    return estadosMap[estado] || estado;
  }
}