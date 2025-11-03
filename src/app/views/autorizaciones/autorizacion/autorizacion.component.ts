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

  laboratoriosOptions = [
    { value: 'laboratorio1', label: 'Laboratorio Clínico ABC' },
    { value: 'laboratorio2', label: 'Laboratorio Central' },
    { value: 'laboratorio3', label: 'Laboratorio Diagnóstico XYZ' },
  ];

  tratamientoFinal = '';

  pacienteData: any;

  columnasIndividual = [
    { key: 'nombreMedicamentoPresentacion', label: 'Medicamento' },
    { key: 'cantidadPorCiclo', label: 'Cantidad' },
    { key: 'unidad', label: 'Cantidad solicitada', tipo: 'number' },
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
    fecha: '',
    fecha_vencimiento: ''
  };

  laboratoriosAut: any[] = [{ 
    autorizacion: '', 
    fecha: '', 
    fecha_vencimiento: '', 
    laboratorio: '' }
  ];

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

  agregarLaboratorioAut() {
    this.laboratoriosAut.push({
      autorizacion: '',
      fecha: '',
      fecha_vencimiento: '',
      laboratorio: ''
    });
  }

  eliminarLaboratorioAut(index: number) {
    this.laboratoriosAut.splice(index, 1);
  }


  copiarAutorizaciones() {
    if (!this.datos.length) return;

    const primeraFila = this.datos[0];

    const { numeroAutorizacion, fechaAutorizacion, fechaVencimiento } = primeraFila;

    // Validación para evitar copiar campos vacíos
    if (!numeroAutorizacion && !fechaAutorizacion && !fechaVencimiento) {
      alert('Por favor completa la primera fila antes de copiar.');
      return;
    }

    // Recorre todas las filas (menos la primera) y copia los datos
    for (let i = 1; i < this.datos.length; i++) {
      this.datos[i].numeroAutorizacion = numeroAutorizacion;
      this.datos[i].fechaAutorizacion = fechaAutorizacion;
      this.datos[i].fechaVencimiento = fechaVencimiento;
    }

    console.log('Datos actualizados:', this.datos);
  }

  volver() {
    this.router.navigate(['autorizaciones/busquedaAU'])
  }

  Cancelar() {
    this.laboratorios = [{ autorizacion: '', fecha: '', descripcion: '' }];
    this.autorizacion = { numero: '', fecha: '', fecha_vencimiento: '' };
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
