import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteResponseDto } from '../../../models/paciente';
import { AutorizacionesService } from '../../../services/autorizaciones.service';

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
    private route: ActivatedRoute, 
    private autorizacionesService: AutorizacionesService
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

  pacienteData: any;

  columnasIndividual = [
    { key: 'nombreMedicamentoPresentacion', label: 'Medicamento' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'unidad', label: 'Unidad', tipo: 'number' },
    { key: 'numeroAutorizacion', label: 'No. Autorización', tipo: 'text' },
    { key: 'fechaAutorizacion', label: 'Fecha', tipo: 'fecha' },
    { key: 'fechaVencimiento', label: 'Fecha vencimiento', tipo: 'fecha' }
  ];

  datos: any[] = [];

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

    this.autorizacionesService.getPacienteByDocumento(this.identificacion)
      .subscribe({
        next: (resp) => {
          console.log('Respuesta autorizaciones:', resp);

          if (resp && resp.paciente) {
            this.pacienteData = resp.paciente;

            this.paciente = `${resp.paciente.nombre1} ${resp.paciente.nombre2 || ''} ${resp.paciente.apellido1} ${resp.paciente.apellido2 || ''}`.trim();
            this.identificacion = resp.paciente.documento;
            this.protocolo = resp.nombreProtocolo || '';
            this.eps = resp.paciente.eps;
            this.tratamientoFinal = `${resp.tratamientoNombre || 'N/A'} - ${resp.tratamientoTipo || 'N/A'}`;

            // Cargar medicamentos en la tabla
            this.datos = resp.autorizaciones || [];
          }
        },
        error: (err) => {
          console.error('Error al obtener autorizaciones:', err);
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
