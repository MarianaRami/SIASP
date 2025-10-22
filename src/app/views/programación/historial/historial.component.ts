import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupMotivoComponent } from '../../../components/popup-motivo/popup-motivo.component';
import { PopupMedicamentosObvComponent } from '../popup-medicamentos-obv/popup-medicamentos-obv.component';
import { PopUpProgramacionComponent } from '../pop-up-programacion/pop-up-programacion.component';
import { AuthService } from '../../../services/auth.service';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { PacienteResponseDto, CreateProtocoloPacienteCompletoDto, CicloDto } from '../../../models/paciente';
import { ProgramacionService } from '../../../services/programacion.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
  imports: [
    FormsModule, CommonModule,
    TablaDinamicaComponent, PopupMotivoComponent, PopupMedicamentosObvComponent, PopUpProgramacionComponent
  ]
})
export class HistorialComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private miServicio: GestionPacientesService,
    private programacionServicio: ProgramacionService
  ) {}
  pacienteData!: PacienteResponseDto;

  idpaciente = '';
  paciente = '';
  version = '';
  identificacion = '';
  medico = '';
  protocolo = '';
  telefono1 = ''; 
  telefono2 = '';
  tipo = '';
  tratamiento = '';
  especialidad = '';
  nombreTrat!: string | null;
  tipoTrat!: string | null;
  cedula!: string;

  ciclos!: CicloDto[];

  tratamientoOptions = [
    { value: 'poli', label: 'Politerapia' },
    { value: 'mono', label: 'Monoterapia' },
  ];

  tipoTratamientoOptions = [
    { key: 'alta', label: 'Alta toxicidad' },
    { key: 'baja', label: 'Baja toxicidad' },
  ];

  columnas = [
    { key: 'dia', label: 'Día' },
    { key: 'tipo' , label: 'Evento'},
    { key: 'fecha', label: 'Fecha' },
    { key: 'puesto', label: 'Puesto' },
    { key: 'estado', label: 'Estado' },
    { key: 'boton', label: ' ', tipo: 'button' }
  ];
  datos: any[] = [];

  ngOnInit() {
    this.cedula = this.route.snapshot.paramMap.get('cedula') || '';
    
    this.cargarDatos();
  }

  cargarDatos(){
    this.miServicio.getPacienteCompletoByDocumento(this.cedula)
      .subscribe({
        next: (resp) => {
          console.log('Paciente desde backend:', resp);

          if (resp.success && resp.data) {
            this.pacienteData = resp.data;

            const p = resp.data;

            this.idpaciente = resp.data.idPaciente;

            this.paciente = this.pacienteData.nombreCompleto;
            this.identificacion = this.pacienteData.identificacion;
            this.medico = this.pacienteData.medicoTratante;
            this.protocolo = this.pacienteData.protocoloActual?.nombreProtocolo || '';
            this.especialidad = this.pacienteData.especialidad;

            this.telefono1 = this.pacienteData.telefono1;
            this.telefono2 = this.pacienteData.telefono2;

            this.datos = (this.pacienteData.protocoloActual?.eventos || []).map(evento => ({
              ...evento,
              tipo: this.formatearTipoEvento(evento.tipo),
              estado: this.formatearEstado(evento.estado)
            }));

            this.version = this.pacienteData.protocoloActual?.version?.toString() ?? '';

            this.ciclos = this.pacienteData.protocoloActual?.ciclos || [];

            this.nombreTrat = this.tratamientoOptions.find(t => t.value === this.pacienteData.tratamientoNombre)?.label || this.pacienteData.tratamientoNombre;
            this.tipoTrat = this.tipoTratamientoOptions.find(t => t.key === this.pacienteData.tratamientoTipo)?.label || this.pacienteData.tratamientoTipo;
          }
        },
        error: (err) => {
          console.error('Error al obtener paciente:', err);
        }
      });
  }

  formatearTipoEvento(tipo: string): string {
    const mapaTipos: Record<string, string> = {
      examenes: 'Exámenes',
      aplicacion: 'Aplicación',
      retiro: 'Retiro de infusión',
      otro: 'Otro'
    };

    return mapaTipos[tipo] || tipo;
  }

  formatearEstado(estado: string): string {
    const mapaEstados: Record<string, string> = {
      tentativa: 'Tentativa', //Creación inicial de la aplicación, puede tener fecha, pero no se ha aplicado la anterior
      pendiente: 'Pendiente', //El paciente tiene fecha, peor no hora de aplicacón. Realizado por programación.
      programada: 'Programada', //El sistema ha asignado fecha y hora o el paciente fue reprogramado manualmente
      notificada: 'Notificada', //Notificación realizada al paciente, sin cambios de fecha
      revisada: 'Revisada', //Exámenes revisados y aprobados antes de la aplicación
      confirmada: 'Confirmada', //El paciente ha confirmado la cita
      aplicada: 'Aplicada', //Tratamiento aplicado
      cancelada: 'Cancelada', //Cita cancelada por el paciente o el sistema
      reprogramacion: 'Reprogramación' //Cita por reprogramar
    };

    return mapaEstados[estado] || estado;
  }

  programar(datos: any) {
    const usuario = this.AuthService.getUser();
    datos.usuarioModificacion = usuario;

    datos.cedula = this.cedula;
    datos.PacienteComponento = this.paciente;

    const cicloActivo = this.ciclos?.find(ciclo => ciclo.estado === 'activo');
    datos.idCiclo = cicloActivo?.id;

    console.log('Datos para programar:', datos);

    this.programacionServicio.programacionPaciente(datos).subscribe({
      next: (res) => {
        console.log('✅ Programación creada:', res)
        this.cargarDatos();
      },
      error: (err) => console.error('❌ Error:', err)
    });
    this.cerrarPopupP()
  }

  volver() {
    this.router.navigate(['programacion/busquedaPro'])
  }

  historial() {
    this.router.navigate(['programacion/busquedaPro/historial',this.cedula ,'historial'])
  }

  // Pop up motivo
  mostrarPopup = false;

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  // Pop up medicamentos
  mostrarPopupM = false;

  abrirPopupM() {
    this.mostrarPopupM = true;
  }

  cerrarPopupM() {
    this.mostrarPopupM = false;
  }

  GuardarObservacion(observacion: any) {
    const fechaActual = new Date().toISOString();

    const usuario = this.AuthService.getUser();

    const cicloActivo = this.ciclos?.find(ciclo => ciclo.estado === 'activo');

    const datosGuardar = {
      idCiclo: cicloActivo?.id,
      idPaciente: this.idpaciente,
      observaciones: observacion,
      fecha: fechaActual,
      usuarioModificador: usuario
    }

    console.log('Datos para guardar observación:', datosGuardar);

    this.cerrarPopupM();
  }

  // Pop up programación
  mostrarPopupP = false;

  abrirPopupP() {
    this.mostrarPopupP = true;
  }

  cerrarPopupP() {
    this.mostrarPopupP = false;
  }
}
