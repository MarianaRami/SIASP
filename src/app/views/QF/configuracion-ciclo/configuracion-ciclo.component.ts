import { Component } from '@angular/core';
import { PopUpMedicamentosComponent } from '../pop-up-medicamentos/pop-up-medicamentos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { AuthService } from '../../../services/auth.service';
import { ProtocoloActualDto } from '../../../models/paciente';

@Component({
  selector: 'app-configuracion-ciclo',
  imports: [
    PopUpMedicamentosComponent, 
    FormsModule, CommonModule
  ],
  templateUrl: './configuracion-ciclo.component.html',
  styleUrl: './configuracion-ciclo.component.css'
})
export class ConfiguracionCicloComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private miServicio: GestionPacientesService,
  ) {}

  protocoloOriginal: any;

  mostrarPopup = false;
  cedula!: string;

  protocolo: any; 
  version = '';
  ciclo = 0;
  fecha_asignacion = '';
  fecha_consulta = '';
  fecha_inicio_estimada = '';
  cie10 = '';
  peso = '';
  superficie = '';
  tfg = '';
  talla = '';
  conc_medicamentos: boolean = false;

  config_medicamentos: any[] = [];

  infoCicloCompleta: any = {};

  mostrarPopupMedicamentos = false;
  mostrarPopupMedicamentosDetalle = false;
  medicamentos: any[] = [];

  protocoloActual!: ProtocoloActualDto | null;

  ciclosDisponibles: number[] = Array.from({ length: 20 }, (_, i) => i + 1);

  columnas = [
    { key: 'Aplicacion', label: 'No. Aplicación' },
    { key: 'Fecha', label: 'Fecha programada' },
    { key: 'Estado', label: 'Estado' }
  ];
  datos: any[] = [];

  eventos: any[] = [
    { dia: 0, tipo: '', observacion: '', activo: true }
  ];

  opcionesEvento = [
    { label: 'Exámenes', value: 'examenes' },
    { label:'Aplicación', value: 'aplicacion' }, 
    { label:'Retiro de infusión', value: 'retiro' },
    { label: 'Otro', value: 'otro' }
  ];

  ngOnInit() {
    this.cedula = this.route.snapshot.paramMap.get('cedula') || '';

    this.miServicio.getPacienteCompletoByDocumento(this.cedula)
      .subscribe({
        next: (resp) => {
          console.log('Paciente desde backend:', resp);

          if ( resp.success && resp.data ) {
            //this.pacienteData = resp.data.protocoloActual;

            const idProtocoloPaciente = this.route.snapshot.queryParamMap.get('idProtocoloPaciente');
            if (resp.data.protocolosActuales && resp.data.protocolosActuales.length > 0) {
              this.protocoloActual = (idProtocoloPaciente
                ? resp.data.protocolosActuales.find((p: any) => p.idProtocoloPaciente === idProtocoloPaciente)
                : null) || resp.data.protocolosActuales[0];
            } else {
              this.protocoloActual = null;
            }
            //this.protocoloOriginal = this.protocoloActual;

            this.conc_medicamentos = this.protocoloActual?.conciliacionMedicamentos || false;
            this.protocolo = this.protocoloActual?.nombreProtocolo || '';
            this.version = this.protocoloActual?.version.toString() || '';
            this.peso = this.protocoloActual?.indicadores.peso || '';
            this.superficie = this.protocoloActual?.indicadores.sc || '';
            this.talla = this.protocoloActual?.indicadores.talla || '';
            this.tfg = this.protocoloActual?.indicadores.tfg || '';
            this.medicamentos = this.protocoloActual?.medicamentos || [];

            if (this.protocoloActual?.ciclos && this.protocoloActual.ciclos.length > 0) {
              // Si hay ciclos, tomar el ciclo activo
              const cicloActivo = this.protocoloActual.ciclos.find((c: any) => c.estado == 'borrador') || this.protocoloActual.ciclos[0];
              this.fecha_inicio_estimada = (cicloActivo.estado !== 'finalizado' && cicloActivo.estado !== 'suspendido')? cicloActivo.fechaIniEstimada || '' : '';
            } else {
              // Si no hay ciclos dejar vacío
              this.fecha_inicio_estimada = '';
            }

            this.ciclo = this.protocoloActual?.numeroCiclo || 0;
            this.fecha_consulta = this.protocoloActual?.fechaConsulta || '';
            this.fecha_asignacion = this.protocoloActual?.fechaCreacion || '';
            
            this.eventos = this.protocoloActual?.eventos?.map((evento: any) => ({
              dia: Number(evento.dia),
              tipo: evento.tipo || '',
              observacion: evento.observacion || '',
              activo: evento.activo !== false
            })) || [{ dia: 0, tipo: '', observacion: '', activo: true }];
          }
        },
        error: (err) => {
          console.error('Error obteniendo protocolo:', err);
        }
      });
  }

  agregarFila() {
    this.eventos.push({ dia: 0, tipo: '', observacion: '', activo: true });
  }

  eliminarFila(index: number) {
    this.eventos.splice(index, 1);
  }

  abrirPopupMedicamentos() {
    this.mostrarPopupMedicamentos = true;
  }

  cerrarPopupMedicamentos() {
    this.mostrarPopupMedicamentos = false;
  }


  volver() {
    this.router.navigate(['qf/busqueda/paciente', this.cedula])
  }

  abrirResumenFinal(datos: any) {
    this.mostrarPopupMedicamentosDetalle = false;
    this.infoCicloCompleta.medicamentos = datos;

    // Clona el protocolo original para no modificar el objeto original
    const protocoloFinal = { ...this.protocoloActual };


    protocoloFinal.idProtocoloPaciente = this.protocoloActual?.idProtocoloPaciente || '';
    protocoloFinal.idPaciente = this.protocoloActual?.idPaciente || '';
    protocoloFinal.idServinte = this.protocoloActual?.idServinte || '';
    // Actualiza los campos con lo que el usuario llenó
    if (protocoloFinal.indicadores?.peso !== undefined && protocoloFinal.indicadores?.peso !== null) {
      protocoloFinal.indicadores.peso = this.peso || "0";
    }
    if (protocoloFinal.indicadores?.sc !== undefined && protocoloFinal.indicadores?.sc !== null) {
      protocoloFinal.indicadores.sc = this.superficie || "0";
    }
    if (protocoloFinal.indicadores?.tfg !== undefined && protocoloFinal.indicadores?.tfg !== null) {
      protocoloFinal.indicadores.tfg = this.tfg || "0";
    }
    if (protocoloFinal.indicadores?.talla !== undefined && protocoloFinal.indicadores?.talla !== null) {
      protocoloFinal.indicadores.talla = this.talla || "0";
    }
    protocoloFinal.fechaConsulta = this.fecha_consulta;
    protocoloFinal.fecha_inicio_estimada = this.fecha_inicio_estimada;

    protocoloFinal.conciliacionMedicamentos = this.conc_medicamentos

    // Actualiza medicamentos
    protocoloFinal.medicamentos = this.infoCicloCompleta.medicamentos;

    // Actualiza eventos si el usuario los modificó
    protocoloFinal.eventos = this.eventos;

    protocoloFinal.numeroCiclo = this.ciclo;

    // Navega al nuevo componente y le pasa el protocolo final
    this.router.navigate(
      ['qf/busqueda/paciente', this.cedula, 'conf-ciclo', 'conf-aplicaciones'],
      { state: { info: protocoloFinal } }
    );
  }

  guardarBorrador(datos: any) {
    this.mostrarPopupMedicamentosDetalle = false;
    this.infoCicloCompleta.medicamentos = datos;

    // Clona el protocolo original para no modificar el objeto original
    let protocoloFinal : any = {};

    //console.log("protocolo original: ", protocoloFinal);

    if(this.protocoloActual?.idProtocoloPaciente){
      protocoloFinal.idProtocoloPaciente = this.protocoloActual.idProtocoloPaciente;
    }else{
      protocoloFinal.idProtocoloPaciente = '';
    }
    protocoloFinal.idPaciente = this.protocoloActual?.idPaciente || '';

    let config_meds : {dia: number, medicamentos: {nombre: string, dosis: number}[]}[] = [];
    let meds :{nombre: string, dosis: number}[] = [];

    if(this.protocoloActual?.configuracionMedicamentos){
      for(const confmed of this.protocoloActual.configuracionMedicamentos){
        let medsConf = confmed.medicamentos || [];
        meds = [];
        for(const med of medsConf){
          meds.push({
            nombre: med.nombre || '',
            dosis: Number(med.dosis) || 0
          });
        }

        config_meds.push({
          dia: Number(confmed.dia) || 0,
          medicamentos: meds
        });
      
      }
    }

    protocoloFinal.configuracionMedicamentos = config_meds;

    protocoloFinal.descripcion = this.protocoloActual?.descripcion || '';
    protocoloFinal.numeroCiclo = this.ciclo;
    protocoloFinal.numero_ciclos = (this.protocoloActual?.numero_ciclos || 0) ;
    protocoloFinal.nombreProtocolo = this.protocoloActual?.nombreProtocolo || '';
    protocoloFinal.version = this.protocoloActual?.version || 1;
    protocoloFinal.fechaCreacion = this.protocoloActual?.fechaCreacion || new Date().toISOString();
    protocoloFinal.ciclos = this.protocoloActual?.ciclos || [];
    // Actualiza los campos con lo que el usuario llenó
    if(protocoloFinal.indicadores){
      protocoloFinal.indicadores.peso = this.peso || "0";
      protocoloFinal.indicadores.sc = this.superficie || "0";
      protocoloFinal.indicadores.tfg = this.tfg || "0";
      protocoloFinal.indicadores.talla = this.talla || "0";
    }
    protocoloFinal.fechaConsulta = this.fecha_consulta;
    protocoloFinal.fecha_inicio_estimada = this.fecha_inicio_estimada;

    protocoloFinal.conciliacionMedicamentos = this.conc_medicamentos;

    // Actualiza medicamentos
    protocoloFinal.medicamentos = this.infoCicloCompleta.medicamentos;


    // Actualiza eventos si el usuario los modificó
    protocoloFinal.eventos = this.eventos;

    protocoloFinal.presentaciones = [];
    
    protocoloFinal.estado = 'borrador';

    const usuario = this.AuthService.getUser();
    protocoloFinal.usuarioCreacion = usuario? usuario : 'desconocido';

    console.log("esto mando para crear el ciclo: ", protocoloFinal)

    this.miServicio.createCicloPaciente(protocoloFinal).subscribe({
      next: (resp) => {
        console.log('✅ Ciclo creado:', resp);
        alert('Configuración guardada como borrador exitosamente.');
        this.router.navigate(['qf/busqueda']);
      },
      error: (err) => {
        console.error('❌ Error creando ciclo:', err);
      }
    });
  }

}
