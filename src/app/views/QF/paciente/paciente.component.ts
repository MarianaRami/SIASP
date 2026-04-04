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
  medicoTratante = '';
  codigoMedicoTratante = 0;

  protocoloCompleto!: CicloDto | null; 
  ciclos: any[] = [];

  protocoloActual!: ProtocoloActualDto | null;
  sinProtocoloParaCie: boolean = false;

  mensajeError: string = '';

  diagnosticos: any[] = [];
  cieSeleccionado: string = '';
  indicadores: any = {
    peso: 0, 
    talla: 0,
    tfg: 0,
    fecha: ''
  };

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
    this.router.navigate(
      ['qf/busqueda/paciente', this.cedula, 'conf-ciclo'],
      { queryParams: { idProtocoloPaciente: this.protocoloActual?.idProtocoloPaciente } }
    )
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

            // ahora el backend ya trae nombre completo y identificacion
            this.paciente = this.construirNombreCompleto(this.pacienteData);
            this.identificacion = this.construirIdentificacionCompleta(this.pacienteData);
            this.eps = this.pacienteData.eps;
            this.diagnosticos = this.pacienteData.diagnosticos && this.pacienteData.diagnosticos.length > 0 ? this.pacienteData.diagnosticos : [];

            const ind = this.pacienteData.indicadores;
            this.indicadores = {
              peso: ind?.peso ?? null,
              talla: ind?.talla ?? null,
              tfg: ind?.tfg ?? null,
              fecha: ind?.fecha ? new Date(ind.fecha) : new Date()
            };

            if (this.diagnosticos.length > 0) {
              this.cie10 = this.construirCIE11Completa(this.diagnosticos[0]);
              this.cieSeleccionado = this.diagnosticos[0].descripcion;
              this.especialidad = this.construirEspecialidadCompleta(this.diagnosticos[0]);
              this.nombreEspecialidad = this.diagnosticos[0].nombreEspecialidad;
              this.actualizarProtocoloPorCie(this.diagnosticos[0].codigo);
            } else {
              const primerProtocolo = p.protocolosActuales?.[0] || null;
              this.protocoloActual = primerProtocolo;
              this.protocolo = primerProtocolo?.nombreProtocolo || '';
              this.version = primerProtocolo ? String(primerProtocolo.version || '') : '';
              this.medico = primerProtocolo?.medicoTratante || this.pacienteData.medicoTratante || '';
              this.especialidad = primerProtocolo?.nombreEspecialidad || '';
              this.nombreEspecialidad = primerProtocolo?.nombreEspecialidad || '';
              this.ciclos = primerProtocolo?.ciclos || [];
              this.sinProtocoloParaCie = !primerProtocolo;
              this.datos = this.ciclos.map((ciclo: any) => ({
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

    const diag = this.diagnosticos.find(d => d.descripcion === this.cieSeleccionado)
      || this.diagnosticos[0];

    const CIE11 = diag?.codigo || '';
    const CIE11Descripcion = diag?.descripcion || '';
    const codigoEspecialidad = diag?.codigoEspecialidad || '';
    const nombreEspecialidad = diag?.nombreEspecialidad || '';

    // Paciente ya registrado en BD local: solo asignar protocolo
    if (this.pacienteData.fuenteDatos === 'paciente') {
      const dto: CreateProtocoloPacienteCompletoDto = {
        fechaConsulta: formData.fechaConsulta,
        CIE11,
        CIE11Descripcion,
        medicoTratante: this.medicoTratante,
        codigoMedicoTratante: Number(this.codigoMedicoTratante),
        nombreEspecialidad,
        codigoEspecialidad,
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
        tratamiento: formData.tratamiento,
        tipoTratamiento: formData.tipoTratamiento
      };

      console.log('Asignando protocolo a paciente existente:', dto);

      this.miServicio.asignarNuevoProtocoloPaciente(dto).subscribe({
        next: (resp) => {
          console.log('Protocolo asignado correctamente:', resp);
          alert('Paciente guardado con éxito');
          this.cargaDatos();
        },
        error: (err) => {
          console.error('Error al asignar protocolo:', err);
          alert('Error al guardar paciente');
        }
      });
      return;
    }

    // Paciente de servinte: crear en BD local junto con el protocolo
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
      indicadores: this.indicadores,
      diagnosticos: this.diagnosticos.map(d => ({
        codigo: d.codigo,
        descripcion: d.descripcion,
        codigoEspecialidad: d.codigoEspecialidad,
        nombreEspecialidad: d.nombreEspecialidad
      })),
      idProtocolo: formData.idProtocolo,
      codigoEspecialidad,
      fechaConsulta: formData.fechaConsulta,
      tipo: formData.tipoPaciente,
      razonTratamiento: formData.razon,
      nombreEspecialidad,
      CIE11Descripcion,
      CIE11,
      tratamientoNombre: formData.tratamiento,
      tratamientoTipo: formData.tipoTratamiento,
      medicoTratante: this.medicoTratante,
      codigoMedicoTratante: Number(this.codigoMedicoTratante),
      usuarioCreacion: usuario
    };

    console.log('Creando paciente nuevo desde servinte:', nuevoPacienteDto);

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

      const diagSeleccionado = this.diagnosticos.find(d => d.descripcion === this.cieSeleccionado);

      const dto: CreateProtocoloPacienteCompletoDto = {
        fechaConsulta: formData.fechaConsulta,
        // fechaInicio: formData.fechaInicio,
        CIE11: diagSeleccionado?.codigo || this.cieSeleccionado,
        CIE11Descripcion: diagSeleccionado?.descripcion || this.cieSeleccionado,
        medicoTratante: this.medicoTratante,
        codigoMedicoTratante: Number(this.codigoMedicoTratante),
        nombreEspecialidad: diagSeleccionado?.nombreEspecialidad || this.nombreEspecialidad,
        codigoEspecialidad: diagSeleccionado?.codigoEspecialidad || this.especialidad,

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

  actualizarProtocoloPorCie(codigoCie: string) {
    const protocolos = this.pacienteData?.protocolosActuales || [];
    const encontrado = protocolos.find(p => p.CIE11 === codigoCie) || null;
    const diagActual = this.diagnosticos.find(d => d.codigo === codigoCie);

    this.protocoloActual = encontrado;
    this.protocolo = encontrado?.nombreProtocolo || '';
    this.version = encontrado ? String(encontrado.version || '') : '';
    this.medicoTratante = encontrado?.medicoTratante || diagActual?.medicoTratante || this.pacienteData?.medicoTratante || '';
    this.codigoMedicoTratante = Number(encontrado?.codigoMedicoTratante) || Number(diagActual?.codigoMedicoTratante) || 0;
    this.medico = this.medicoTratante;
    this.ciclos = encontrado?.ciclos || [];
    this.sinProtocoloParaCie = !encontrado;

    this.datos = this.ciclos.map((ciclo: any) => ({
      ciclo: ciclo.numCiclo,
      estado: this.formatearEstado(ciclo.estado),
      fechaFinEstimada: ciclo.fechaFinReal || '-'
    }));
  }

  onCieChange() {
    const diag = this.diagnosticos.find(d => d.descripcion === this.cieSeleccionado);
    if (!diag) return;
    this.cie10 = this.construirCIE11Completa(diag);
    this.especialidad = this.construirEspecialidadCompleta(diag);
    this.nombreEspecialidad = diag.nombreEspecialidad;
    this.actualizarProtocoloPorCie(diag.codigo);
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