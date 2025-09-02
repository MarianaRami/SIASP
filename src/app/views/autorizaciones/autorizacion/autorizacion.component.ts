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

  pacienteData!: PacienteResponseDto;

  tipoOpciones = ['Individual', 'Universal']; 
  tipoSeleccionado = 'Individual';

  columnasUniversal = [
    { key: 'Medicamento', label: 'Medicamento' },
    { key: 'Presentacion', label: 'Presentación' },
    { key: 'Cantidad', label: 'Cantidad' },
    { key: 'Unidad', label: 'Unidad', tipo: 'number' }
  ];

  columnasIndividual = [
    { key: 'Medicamento', label: 'Medicamento' },
    { key: 'Presentacion', label: 'Presentación' },
    { key: 'Cantidad', label: 'Cantidad' },
    { key: 'Unidad', label: 'Unidad', tipo: 'number' },
    { key: 'Autorizacion', label: 'No. Autorización', tipo: 'text' },
    { key: 'Fecha', label: 'Fecha', tipo: 'fecha' }
  ];

  datos = [
    { Medicamento: 'Doxorrubicina', Presentacion: '200mg', Cantidad: '3' },
    { Medicamento: 'Ciclofosfamida', Presentacion: '100mg', Cantidad: '33'  },
    { Medicamento: 'Carboplatino', Presentacion: '50mg', Cantidad: '13' }
  ];

  laboratorios: any[] = [
    { autorizacion: '', fecha: '', descripcion: '' }
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

    if (this.tipoSeleccionado === 'Individual') {
      // Cada fila ya trae sus propios No. Autorización y Fecha desde la tabla
      medicamentosFinal = this.datos;
    } else {
      // Universal → copiar el número y fecha a todos los medicamentos
      medicamentosFinal = this.datos.map(med => ({
        ...med,
        Autorizacion: this.autorizacion.numero,
        Fecha: this.autorizacion.fecha
      }));
    }

    const payload = {
      idPaciente: this.pacienteData?.idPaciente,
      idServinte: this.pacienteData?.idServinte,
      documento: this.pacienteData?.documento,
      tipoAutorizacion: this.tipoSeleccionado,
      autorizacion: this.autorizacion,
      medicamentos: medicamentosFinal,
      laboratorios: this.laboratorios,
    };

    console.log('Payload a guardar:', payload);
  }

}
