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
  conf_medicamentos: boolean = false;

  infoCicloCompleta: any = {};

  mostrarPopupMedicamentos = false;
  mostrarPopupMedicamentosDetalle = false;
  medicamentos: any[] = [];

  protocoActual!: ProtocoloActualDto | null;

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
            this.protocoActual = resp.data.protocoloActual;
            this.protocoloOriginal = resp.data.protocoloActual;

            this.protocolo = this.protocoActual?.nombreProtocolo || '';
            this.version = this.protocoActual?.version.toString() || '';
            this.peso = this.protocoActual?.indicadores.peso || '';
            this.superficie = this.protocoActual?.indicadores.sc || '';
            this.talla = this.protocoActual?.indicadores.talla || '';
            this.tfg = this.protocoActual?.indicadores.tfg || '';
            this.medicamentos = this.protocoActual?.medicamentos || [];

            if (this.protocoActual?.ciclos && this.protocoActual.ciclos.length > 0) {
              // Si hay ciclos, tomar el ciclo activo
              const cicloActivo = this.protocoActual.ciclos.find((c: any) => c.estado === 'activo') || this.protocoActual.ciclos[0];
              this.fecha_inicio_estimada = cicloActivo.fechaIniEstimada || '';
            } else {
              // Si no hay ciclos dejar vacío
              this.fecha_inicio_estimada = '';
            }

            this.ciclo = this.protocoActual?.numeroCiclo || 0;
            this.fecha_consulta = this.protocoActual?.fechaConsulta || '';
            this.fecha_asignacion = this.protocoActual?.fechaCreacion || '';
            
            this.eventos = this.protocoActual?.eventos?.map((evento: any) => ({
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
    const protocoloFinal = { ...this.protocoloOriginal };

    // Actualiza los campos con lo que el usuario llenó
    protocoloFinal.indicadores.peso = parseInt(this.peso);
    protocoloFinal.indicadores.sc = parseInt(this.superficie);
    protocoloFinal.indicadores.tfg = parseInt(this.tfg);
    protocoloFinal.indicadores.talla = parseInt(this.talla);
    protocoloFinal.fechaConsulta = this.fecha_consulta;
    protocoloFinal.fecha_inicio_estimada = this.fecha_inicio_estimada;

    protocoloFinal.conciliacionMedicamentos = this.conf_medicamentos

    // Actualiza medicamentos
    protocoloFinal.medicamentos = this.infoCicloCompleta.medicamentos;

    // Actualiza eventos si el usuario los modificó
    protocoloFinal.eventos = this.eventos;

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
    const protocoloFinal = { ...this.protocoloOriginal };

    // Actualiza los campos con lo que el usuario llenó
    protocoloFinal.indicadores.peso = parseInt(this.peso);
    protocoloFinal.indicadores.sc = parseInt(this.superficie);
    protocoloFinal.indicadores.tfg = parseInt(this.tfg);
    protocoloFinal.indicadores.talla = parseInt(this.talla);
    protocoloFinal.fechaConsulta = this.fecha_consulta;
    protocoloFinal.fecha_inicio_estimada = this.fecha_inicio_estimada;

    protocoloFinal.conciliacionMedicamentos = this.conf_medicamentos

    // Actualiza medicamentos
    protocoloFinal.medicamentos = this.infoCicloCompleta.medicamentos;


    // Actualiza eventos si el usuario los modificó
    protocoloFinal.eventos = this.eventos;

    protocoloFinal.presentaciones = [];
    
    protocoloFinal.estado = 'borrador';

    const usuario = this.AuthService.getUser();
    protocoloFinal.usuarioCreacion = usuario;

    console.log("esto mando para crear el ciclo: ", protocoloFinal)

    this.miServicio.createCicloPaciente(protocoloFinal).subscribe({
      next: (resp) => {
        console.log('✅ Ciclo creado:', resp);
        this.router.navigate(['qf/busqueda']);
      },
      error: (err) => {
        console.error('❌ Error creando ciclo:', err);
      }
    });
  }

}
