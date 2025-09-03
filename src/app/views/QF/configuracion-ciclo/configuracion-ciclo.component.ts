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

  mostrarPopup = false;
  cedula!: string;

  protocolo: any; 
  ciclo = '';
  fecha_asignacion = '';
  fecha_consulta = '';
  cie10 = '';
  peso = '';
  superficie = '';
  tfg = '';
  talla = '';
  conf_medicamentos: '' | undefined;

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
          console.log('Protocolo recibido:', resp);
          this.protocolo = resp.nombreProtocolo;
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

  abrirPopupMedicamentosDetalle() {
    this.mostrarPopupMedicamentos = false;
    this.mostrarPopupMedicamentosDetalle = true;
  }

  cerrarPopupMedicamentosDetalle() {
    this.mostrarPopupMedicamentosDetalle = false;
  }

  volver() {
    this.router.navigate(['qf/busqueda/paciente', this.cedula])
  }
}
