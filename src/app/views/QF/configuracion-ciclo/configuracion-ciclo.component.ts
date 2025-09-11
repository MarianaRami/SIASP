import { Component } from '@angular/core';
import { PopUpMedicamentosComponent } from '../pop-up-medicamentos/pop-up-medicamentos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';

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
    private miServicio: GestionPacientesService
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
  conf_medicamentos: '' | undefined;

  infoCicloCompleta: any = {};

  mostrarPopupMedicamentos = false;
  mostrarPopupMedicamentosDetalle = false;
  medicamentos: any[] = [];

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

    this.miServicio.getProtocoloCompletoByPaciente(this.cedula)
      .subscribe({
        next: (resp) => {
          this.protocoloOriginal = resp;
          console.log('Protocolo recibido:', resp);
          
          this.protocolo = resp.nombreProtocolo;
          this.version = resp.version;
          this.peso = resp.indicadores.peso;
          this.superficie = resp.indicadores.sc;
          this.talla = resp.indicadores.altura;
          this.tfg = resp.indicadores.tfg;
          this.medicamentos = resp.medicamentos || [];

          this.ciclo = resp.numeroCiclo;
          this.fecha_consulta = resp.fechaConsulta;
          this.fecha_asignacion = resp.fechaCreacion;

          this.eventos = resp.eventos?.map((evento: any) => ({
            dia: Number(evento.dia),
            tipo: evento.tipo || '',
            observacion: evento.observacion || '',
            activo: evento.activo !== false
          })) || [{ dia: 0, tipo: '', observacion: '', activo: true }];
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
    protocoloFinal.fecha_consulta = this.fecha_consulta;
    protocoloFinal.fecha_inicio_estimada = this.fecha_inicio_estimada;

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

}
