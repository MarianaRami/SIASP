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
    private autorizacionesService: AutorizacionesService,
    private AuthService: AuthService,
  ) {}

  paciente = '';
  identificacion = '';
  protocolo = '';
  eps = '';
  idCicloPaciente = '';
  idUsuario = '';
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
    { autorizacion: '', fecha: '', fechaVencimiento: '', descripcion: '' }
  ];

  autorizacion = {
    numero: '',
    fecha: '',
    fechaVencimiento: ''
  };

  laboratoriosAut: any[] = [{ 
    autorizacion: '', 
    fecha: '', 
    fechaVencimiento: '', 
    descripcion: '' }
  ];

  ngOnInit() {
    this.cargaDatos()
  }

  cargaDatos() {
    this.identificacion = this.route.snapshot.paramMap.get('cedula') || '';

    this.autorizacionesService.getPacienteByDocumento(this.identificacion)
      .subscribe({
        next: (resp) => {
          console.log('Respuesta autorizaciones:', resp);

          if (resp && resp.paciente) {
            this.pacienteData = resp.paciente;
            this.idCicloPaciente = resp.idCicloPaciente;
            this.paciente = `${resp.paciente.nombre1} ${resp.paciente.nombre2 || ''} ${resp.paciente.apellido1} ${resp.paciente.apellido2 || ''}`.trim();
            this.identificacion = resp.paciente.documento;
            this.protocolo = resp.nombreProtocolo || '';
            this.eps = resp.paciente.eps;
            this.tratamientoFinal = `${resp.tratamientoNombre || 'N/A'} - ${resp.tratamientoTipo || 'N/A'}`;
            this.idUsuario = this.AuthService.getUser() || '';
            
            // 🔹 Cargar medicamentos
            this.datos = resp.medicamentos || [];

            // 🔹 Cargar laboratorios
            if (resp.laboratorios && resp.laboratorios.length > 0) {
              this.laboratoriosAut = resp.laboratorios.map((lab: any) => ({
                autorizacion: lab.numeroAutorizacion || '',
                fecha: lab.fechaAutorizacion || '',
                fechaVencimiento: lab.fechaVencimiento || '',
                descripcion: lab.descripcion || ''
              }));
            } else {
              this.laboratoriosAut = [{ autorizacion: '', fecha: '', fechaVencimiento: '', descripcion: '' }];
            }

            // 🔹 Cargar procedimientos
            if (resp.procedimientos && resp.procedimientos.length > 0) {
              this.laboratorios = resp.procedimientos.map((proc: any) => ({
                autorizacion: proc.numeroAutorizacion || '',
                fecha: proc.fechaAutorizacion || '',
                fechaVencimiento: proc.fechaVencimiento || '',
                descripcion: proc.descripcion || ''
              }));
            } else {
              this.laboratorios = [{ autorizacion: '', fecha: '', fechaVencimiento: '', descripcion: '' }];
            }

            // 🔹 Si hay autorización general
            if (resp.autorizacion) {
              this.autorizacion.numero = resp.autorizacion || '';
              this.autorizacion.fecha = resp.fechaAutorizacion;
              this.autorizacion.fechaVencimiento = resp.fechaVencimientoAutorizacion;
              // Si hay fechas generales de autorización puedes asignarlas aquí
            }
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
      fechaVencimiento: '',
      descripcion: ''
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
    this.autorizacion = { numero: '', fecha: '', fechaVencimiento: '' };
  }

  Guardar() {
    // Validación de medicamentos antes de guardar
    const medicamentosInvalidos = this.datos.filter(
      (m) => m.cantidadPorCiclo !== m.unidad
    );

    if (medicamentosInvalidos.length > 0) {
      const listaErrores = medicamentosInvalidos
        .map((m) => `- ${m.nombreMedicamentoPresentacion}`)
        .join('\n');

      alert(
        `⚠️ Las siguientes filas tienen cantidades diferentes entre la cantidad por ciclo y la cantidad solicitada:\n\n${listaErrores}\n\nPor favor revisa antes de guardar.`
      );
      return; // Detiene el guardado
    }

    // Si pasa la validación, continúa normalmente
    let medicamentosFinal = this.datos;

    const payload = {
      idPaciente: this.pacienteData?.id,
      idCicloPaciente: this.idCicloPaciente,
      idUsuario: this.idUsuario,
      documento: this.pacienteData?.documento,
      autorizacion: this.autorizacion,
      medicamentos: medicamentosFinal,
      procedimientos: this.laboratorios,
      laboratorios: this.laboratoriosAut,
    };

    console.log('✅ Payload a guardar:', payload);

    this.autorizacionesService.createAutorizacionNueva(payload).subscribe({
      next: (resp) => {
        console.log('Respuesta al guardar autorización:', resp);
        alert('✅ Autorización guardada exitosamente.');
        this.router.navigate(['autorizaciones/busquedaAU']);
      },
      error: (err) => {
        console.error('❌ Error al guardar autorización:', err);
        alert('Error al guardar la autorización. Por favor, intenta de nuevo.');
      },
    });
  }

}
