import { Component } from '@angular/core';
import { PopUpMedicamentosComponent } from '../pop-up-medicamentos/pop-up-medicamentos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { PopUpMedicamentosDetalleComponent } from '../pop-up-medicamentos-detalle/pop-up-medicamentos-detalle.component';

@Component({
  selector: 'app-configuracion-ciclo',
  imports: [
    PopUpMedicamentosComponent, PopUpMedicamentosDetalleComponent,
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
  ciclo = '';
  fecha_asignacion = '';
  fecha_consulta = '';
  fecha_inicio_estimada = '';
  cie10 = '';
  peso = '';
  superficie = '';
  tfg = '';
  talla = '';
  conf_medicamentos: '' | undefined;

  medicamentosDetalle: any[] = [];

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
    { label: 'Lavado de catéter', value: 'lavado' },
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

          const ciclo = resp.ciclos?.[0];
          if (ciclo) {
            this.ciclo = ciclo.numCiclo;
            this.fecha_consulta = ciclo.fechaConsulta;
            this.fecha_asignacion = ciclo.fechaIniEstimada;
          }

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

  abrirPopupMedicamentosDetalle(datos: any[]) {
    this.mostrarPopupMedicamentos = false;
    this.mostrarPopupMedicamentosDetalle = true;
    this.medicamentosDetalle = datos; 
    this.infoCicloCompleta.medicamentos = datos;
  }

  cerrarPopupMedicamentosDetalle() {
    this.mostrarPopupMedicamentosDetalle = false;
  }

  abrirResumenFinal(datos: any) {
    this.mostrarPopupMedicamentosDetalle = false;
    this.infoCicloCompleta.presentaciones = datos;

    // Clona el protocolo original para no modificar el objeto original
    const protocoloFinal = { ...this.protocoloOriginal };

    // Actualiza los campos con lo que el usuario llenó
    protocoloFinal.peso = this.peso;
    protocoloFinal.superficie = this.superficie;
    protocoloFinal.tfg = this.tfg;
    protocoloFinal.talla = this.talla;
    protocoloFinal.fecha_consulta = this.fecha_consulta;
    protocoloFinal.fecha_inicio_estimada = this.fecha_inicio_estimada;
    protocoloFinal.conf_medicamentos = this.conf_medicamentos;

    // Actualiza medicamentos
    protocoloFinal.medicamentos = this.infoCicloCompleta.medicamentos;

    // Actualiza presentaciones
    protocoloFinal.presentaciones = this.infoCicloCompleta.presentaciones;

    // Actualiza eventos si el usuario los modificó
    protocoloFinal.eventos = this.eventos;

    // Puedes actualizar otros campos si el usuario los modificó...

    // Navega al nuevo componente y le pasa el protocolo final
    this.router.navigate(
      ['qf/busqueda/paciente', this.cedula, 'conf-ciclo', 'conf-aplicaciones'],
      { state: { info: protocoloFinal } }
    );
  }

  volver() {
    this.router.navigate(['qf/busqueda/paciente', this.cedula])
  }

}
