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
import { PdfService } from '../../../services/pdf.service';

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
    private programacionServicio: ProgramacionService,
    private pdfService: PdfService
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

  tieneCicloActivo = false;

  modoPopup: 'programar' | 'editar' = 'programar';
  eventoAEditar: any = null;

  mostrarBotonProgramar = false;
  mostrarBotonNotificar = false;

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
    { key: 'fecha', label: 'Fecha', tipo: 'date' },
    { key: 'horario', label: 'Horario' },
    { key: 'puesto', label: 'Puesto' },
    { key: 'estado', label: 'Estado' },
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
              estado: this.formatearEstado(evento.estado),
              fecha: this.formatearFecha(evento.fecha)
            }));

            this.version = this.pacienteData.protocoloActual?.version?.toString() ?? '';

            this.ciclos = this.pacienteData.protocoloActual?.ciclos || [];

            this.nombreTrat = this.tratamientoOptions.find(t => t.value === this.pacienteData.tratamientoNombre)?.label || this.pacienteData.tratamientoNombre;
            this.tipoTrat = this.tipoTratamientoOptions.find(t => t.key === this.pacienteData.tratamientoTipo)?.label || this.pacienteData.tratamientoTipo;
          
            //  Verificar si hay un ciclo activo
            this.tieneCicloActivo = this.ciclos.some(ciclo => ciclo.estado === 'activo' || ciclo.estado === 'revisado_examenes' || ciclo.estado === 'notificado');

            // lógica para determinar la visibilidad de los botones programar y editar
            const primerEventoAplicacion = this.pacienteData.protocoloActual?.eventos?.find((e: any) => e.tipo === 'aplicacion');

            if (primerEventoAplicacion) {
              if (primerEventoAplicacion.estado === 'tentativa') {
                this.mostrarBotonProgramar = true;
              } else {
                this.mostrarBotonProgramar = false;

                // Agregar columna solo si no existe
                const existeColumnaBoton = this.columnas.some(c => c.key === 'boton');
                if (!existeColumnaBoton) {
                  this.columnas.push({ key: 'boton', label: ' ', tipo: 'button' });
                }
              }
            } else {
              // Si no hay aplicación, por defecto no mostramos ninguno
              this.mostrarBotonProgramar = false;
            }

            // Lógica para mostrar el botón de notificar
            const eventosAplicacion = this.pacienteData.protocoloActual?.eventos?.filter((e: any) => e.tipo === 'aplicacion') || [];

            const tieneProgramada = eventosAplicacion.some((e: any) => e.estado === 'programada');
            if(tieneProgramada){
              this.mostrarBotonNotificar = true;
            } else {
              this.mostrarBotonNotificar = false;
            }

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
      pendiente: 'Pendiente', //El paciente tiene fecha, pero no hora de aplicacón. Realizado por programación.
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

  formatearFecha(fechaIso: string | null): string {
    if (!fechaIso) {
      return ''; // No mostrar nada si no hay fecha
    }

    const fecha = new Date(fechaIso);

    // Corregir el desfase de zona horaria (mantener fecha UTC "real")
    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
  }

  notificarPaciente() {
    const usuario = this.AuthService.getUser();
    const cicloActivo = this.ciclos?.find(ciclo => ciclo.estado === 'activo');

    const dto = {
      idCiclo: cicloActivo?.id,
      fecha: new Date(),
      usuarioModificacion: usuario,
      estado: 'notificado' 
    };

    console.log('Datos para notificar paciente:', dto);

    this.programacionServicio.notificacionPaciente(dto).subscribe({
      next: (res) => {
        console.log('✅ Paciente notificado correctamente:', res);
        this.cargarDatos();
      },
      error: (err) => {
        console.error('❌ Error al notificar paciente:', err);
      }
    });
  }


  // Pop up programación
  mostrarPopupP = false;

  abrirPopupP() {
    this.modoPopup = 'programar';
    this.mostrarPopupP = true;
  }

  abrirPopupEditar(fila: any) {
    this.modoPopup = 'editar';
    this.eventoAEditar = fila;
    this.mostrarPopupP = true;
  }

  cerrarPopupP() {
    this.mostrarPopupP = false;
  }

  programar(datos: any) {
    const usuario = this.AuthService.getUser();
    const cicloActivo = this.ciclos?.find(ciclo => ciclo.estado === 'activo');

    if (this.modoPopup === 'editar') {
      const payload = {
        cedula: this.cedula,
        idCiclo: cicloActivo?.id,
        fechaEvento: datos.fechaEvento,
        usuarioModificacion: usuario,
        idEvento: this.eventoAEditar.id
      };
      console.log('Datos para editar evento:', payload);
      this.programacionServicio.editarEventoAplicacionPaciente(payload).subscribe({
        next: (res) => {
          console.log('✅ Evento editado:', res);
          this.cargarDatos();
        },
        error: (err) => console.error('❌ Error al editar evento:', err)
      });

      // Cambio de silla
      const programaSillaDto = {
        idEvento: this.eventoAEditar.id,
        idSilla: datos.idSilla,
        fecha: datos.fechaEvento,
        horaInicio: datos.horaInicio,
        horaFin: datos.horaFin,
        duracion: datos.duracion,
        usuarioModificacion: usuario
      };
      console.log('Datos para programar silla:', programaSillaDto);
      this.programacionServicio.programarSilla(programaSillaDto).subscribe({
        next: (res) => {
          console.log('✅ Silla programada:', res);
          this.cargarDatos();
        },
        error: (err) => console.error('❌ Error al programar silla:', err)
      });

    } else {
      datos.usuarioModificacion = usuario;
      datos.cedula = this.cedula;
      datos.PacienteComponento = this.paciente;
      datos.idCiclo = cicloActivo?.id;

      console.log('Datos para programar:', datos);
      this.programacionServicio.programacionPaciente(datos).subscribe({
        next: (res) => {
          console.log('✅ Programación creada:', res);
          this.cargarDatos();
        },
        error: (err) => console.error('❌ Error:', err)
      });
    }

    this.cerrarPopupP();
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

  cancelarCiclo(datos: any){
    const usuario = this.AuthService.getUser();
    const cicloActivo = this.ciclos?.find(ciclo => ciclo.estado === 'activo');

    const payload = {
      idCiclo: cicloActivo?.id,
      fecha: new Date().toISOString(),
      usuarioModificacion: usuario,
      causaFinalizacion: datos.motivo,
      observacion: datos.observaciones,

    }

    console.log('Datos para cancelar ciclo:', payload);
    this.programacionServicio.cancelarCiclo(payload).subscribe({
      next: (res) => {
        console.log('✅ Ciclo cancelado:', res);
        this.cargarDatos();
      },
      error: (err) => console.error('❌ Error al cancelar ciclo:', err)
    });

    this.cerrarPopup();
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
    this.programacionServicio.pacienteObservacionMed(datosGuardar).subscribe({
      next: (res) => {
        console.log('✅ Observación guardada:', res);
        this.cargarDatos();
      },
      error: (err) => console.error('❌ Error al guardar observación:', err)
    });
    this.cerrarPopupM();
  }

  descargarPDF() {
    const pacienteInfo = {
      nombre: this.paciente,
      identificacion: this.identificacion,
      protocolo: this.protocolo,
      medico: this.medico,
      telefono1: this.telefono1,
      telefono2: this.telefono2,
    };

    this.pdfService.generarPDF(this.columnas, this.datos, 'Progrmación del paciente', pacienteInfo);
  }
}
