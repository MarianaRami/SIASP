import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteResponseDto } from '../../../models/paciente';


@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrl: './autorizacion.component.css',
  imports: [
    FormsModule, CommonModule,
    TablaDinamicaComponent
],
})
export class AutorizacionComponent {
  constructor(
    private router: Router,
    private miServicio: GestionPacientesService,
    private AuthService: AuthService,
    private route: ActivatedRoute
  ) {}

  paciente = '';
  identificacion = '';
  protocolo = '';
  eps = '';
  tratamientoOptions = [
    { value: 'poli', label: 'Politerapia' },
    { value: 'mono', label: 'Monoterapia' },
  ];

  tipoTratamientoOptions = [
    { key: 'alta', label: 'Alta toxicidad' },
    { key: 'baja', label: 'Baja toxicidad' },
  ];

  tratamientoFinal = '';

  pacienteData!: PacienteResponseDto;

  columnasIndividual = [
    { key: 'medicamento', label: 'Medicamento' },
    { key: 'presentacion', label: 'Presentación' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'unidad', label: 'Unidad', tipo: 'number' },
    { key: 'autorizacion', label: 'No. Autorización', tipo: 'text' },
    { key: 'fecha', label: 'Fecha', tipo: 'fecha' },
    { key: 'fecha_vencimiento', label: 'Fecha vencimiento', tipo: 'fecha' }
  ];

  datos = [
    { medicamento: 'Doxorrubicina', presentacion: '200mg', cantidad: '3' },
    { medicamento: 'Ciclofosfamida', presentacion: '100mg', cantidad: '33'  },
    { medicamento: 'Carboplatino', presentacion: '50mg', cantidad: '13' }
  ];

  laboratorios: any[] = [
    { autorizacion: '', fecha: '', fecha_vencimiento: '', descripcion: '' }
  ];

  autorizacion = {
    numero: '',
    fecha: ''
  };

  ngOnInit() {
    this.cargaDatos()
  }

  cargaDatos(){
    this.identificacion = this.route.snapshot.paramMap.get('cedula') || '';
    
    this.miServicio.getPacienteCompletoByDocumento(this.identificacion)
      .subscribe({
        next: (resp) => {
          console.log('Paciente desde backend:', resp);

          if (resp.success && resp.data) {
            this.pacienteData = resp.data;

            const p = resp.data;

            // ahora el backend ya trae nombre completo y identificacion
            this.paciente = this.pacienteData.nombreCompleto;
            this.identificacion = this.pacienteData.identificacion;
            this.protocolo = this.pacienteData.protocoloActual?.nombreProtocolo || '';
            this.eps = this.pacienteData.eps;    

            const nombreTrat = this.tratamientoOptions.find(t => t.value === this.pacienteData.tratamientoNombre)?.label || this.pacienteData.tratamientoNombre;
            const tipoTrat = this.tipoTratamientoOptions.find(t => t.key === this.pacienteData.tratamientoTipo)?.label || this.pacienteData.tratamientoTipo;

            this.tratamientoFinal = `${nombreTrat} - ${tipoTrat}`;
          }
        },
        error: (err) => {
          console.error('Error al obtener paciente:', err);
        }
      });
  }

  agregarLaboratorio() {
    this.laboratorios.push({ autorizacion: '', fecha: '', descripcion: '' });
  }

  eliminarLaboratorio(index: number) {
    this.laboratorios.splice(index, 1);
  }

  volver() {
    this.router.navigate(['autorizaciones/busquedaAU'])
  }

  Cancelar() {
    this.laboratorios = [{ autorizacion: '', fecha: '', descripcion: '' }];
    this.autorizacion = { numero: '', fecha: '' };
  }

  Guardar() {
    let medicamentosFinal = [];
      // Cada fila ya trae sus propios No. Autorización y Fecha desde la tabla
      medicamentosFinal = this.datos;


    const payload = {
      idPaciente: this.pacienteData?.idPaciente,
      idServinte: this.pacienteData?.idServinte,
      documento: this.pacienteData?.documento,
      autorizacion: this.autorizacion,
      medicamentos: medicamentosFinal,
      laboratorios: this.laboratorios,
    };

    console.log('Payload a guardar:', payload);
  }

}
