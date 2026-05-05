import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GestionPacientesService } from '../../services/gestion-pacientes.service';


@Component({
  selector: 'app-enfermeria',
  standalone: true,
  templateUrl: './enfermeria.component.html',
  styleUrls: ['./enfermeria.component.css'],
  imports: [TablaDinamicaComponent, CommonModule, FormsModule]
})

export class EnfermeriaComponent {

  constructor(
    private service: GestionPacientesService,
    private authService: AuthService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'telefonos', label: 'Teléfono' },
    { key: 'estado', label: 'Estado', tipo: 'select', opciones: ['Aplicada', 'Suspendida', 'Reprogramar', 'Inasistencia'] },
    { key: 'observacion', label: 'Observaciones', tipo: 'text' },
    {
      key: 'razonReprogramacion', label: 'Razón reprogramación', tipo: 'select-condicional',
      dependsOn: 'estado', dependsValue: ['Reprogramar', 'Suspendida', 'Inasistencia'],
      opciones: [
        { value: 'toxicidad',                  label: 'Toxicidad' },
        { value: 'inasistencia_voluntaria',     label: 'Inasistencia voluntaria' },
        { value: 'indisponibilidad_paciente',   label: 'Indisponibilidad del paciente' },
        { value: 'solicitud_paciente',          label: 'Solicitud del paciente' },
        { value: 'otro',                        label: 'Otro' },
      ]
    },
  ];

  datos: any[] = [];
  datosFiltrados: any[] = [];
  datosOriginales: { [cedula: string]: any } = {};

  tipoPaciente = 'ambulatorio'

  opcionesTipoPaciente = [
    { value: 'ambulatorio', label: 'Ambulatorio' },
    { value: 'hospitalizado', label: 'Hospitalizado' }
  ];

  filtro: string = '';
  fechaActual = new Date();
  fechaSeleccionada: string = this.formatearFecha(this.fechaActual); // formato yyyy-MM-dd

  ngOnInit() {
    this.cargarPacientes(this.fechaSeleccionada);
  }

  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarPacientes(fecha: string) {
    this.service.getlistadoEnfermeriaPaciente(fecha, this.tipoPaciente).subscribe({
      next: (res) => {
        console.log("Pacientes enfermería:", res);

        this.datos = res.pacientesConf || [];
        this.datosFiltrados = [...this.datos];

        // Guardar copia original
        this.datosOriginales = {};
        this.datos.forEach(d => {
          this.datosOriginales[d.cedula] = { ...d };
        });
      },
      error: (err) => {
        console.error("Error al cargar pacientes:", err);
      }
    });
  }

  onFechaChange() {
    this.cargarPacientes(this.fechaSeleccionada);
  }

  onTipoPacienteChange() {
    this.filtro = '';
    this.cargarPacientes(this.fechaSeleccionada);
  }

  // -------------------------------
  // 🔍 FILTRO
  // -------------------------------
  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
      d.cedula?.toLowerCase().includes(f) ||
      d.nombre?.toLowerCase().includes(f)
    );
  }

  // -------------------------------
  // 💾 GUARDAR CAMBIOS
  // -------------------------------
  guardar() {
    const usuario = this.authService.getUser();

    const cambios = this.datos.filter((pac) => {
      const original = this.datosOriginales[pac.cedula];
      return (
        original &&
        (original.estado !== pac.estado ||
         original.observacion !== pac.observacion)
      );
    });

    if (cambios.length === 0) {
      alert("No hay cambios para guardar");
      return;
    }

    // Crear el payload
    const payload = {
      confirmaciones: cambios.map((p) => ({
        idCiclo: this.datosOriginales[p.cedula]?.idCicloPaciente || null,
        idEvento: this.datosOriginales[p.cedula]?.idEventoPaciente || null,
        //cedula: p.cedula,
        estado: p.estado === 'Aplicada' ? 'aplicada' :  p.estado === 'Inasistencia' ? 'inasistencia' :  p.estado === 'Suspendida' ? 'suspendida' :  'reprogramacion',
        observacion: p.observacion,
        fecha: this.fechaSeleccionada,
        usuarioModificacion: usuario,
        razonReprogramacion: (p.estado === 'Reprogramar' || p.estado === 'Inasistencia') ? (p.razonReprogramacion ?? null) : null
      }))
    };

    console.log("📤 Enviando payload enfermería:", payload);

    this.service.postregistrarAsistencias(payload).subscribe({
      next: (res) => {
        alert("Cambios guardados correctamente");
        console.log("Respuesta backend:", res);

        // Actualizar copia original
        cambios.forEach(c => {
          this.datosOriginales[c.cedula] = { ...c };
        });
        this.cargarPacientes(this.fechaSeleccionada);
      },
      error: (err) => {
        console.error("❌ Error al guardar:", err);
        alert("Error al guardar la información");
      }
    });
  }
}
