import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../services/gestion-pacientes.service';
import { AuthService } from '../../services/auth.service';

interface ExamenesPendientes {
  success: boolean;
  autorizaciones: {
    id: string;
    cantidadPorCiclo: number;
    fechaAutorizacion: string;
    fechaVencimiento: string;
    numeroAutorizacion: string;
    tipoEvento: string;
    descripcion: string;
  }[];
}

interface ExamenPaciente {
  nombre: string;
  cedula: string;
  nombreProtocolo: string;
  idCicloPaciente: string;
  examenesPendientes: ExamenesPendientes;
  estado: string;
  observación: string;
  examenesPendientesTexto?: string; 
}


@Component({
  selector: 'app-examenes',
  standalone: true,
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
  imports: [TablaDinamicaComponent, CommonModule, FormsModule],
})
export class ExamenesComponent {
  constructor(
    private miServicio: GestionPacientesService,
    private AuthService: AuthService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'examenesPendientesTexto', label: 'Exámenes' },
    {
      key: 'estado',
      label: 'Estado',
      tipo: 'select',
      opciones: ['Confirmado', 'Reprogramar']
    },
    { key: 'observación', label: 'Observación', tipo: 'text' }
  ];

  datos: ExamenPaciente[] = [];
  datosFiltrados: ExamenPaciente[] = [];

  fechaActual: Date = new Date();
  fechaSeleccionada: string = this.fechaActual.toISOString().split('T')[0]; // formato yyyy-MM-dd
  filtro: string = '';

  datosOriginales: { [cedula: string]: ExamenPaciente } = {};

  ngOnInit() {
    this.cargarExamenes(this.fechaActual);
  }

  cargarExamenes(fecha: Date) {
    this.miServicio.getlistadoExamenesPaciente(fecha).subscribe({
      next: (res: { pacientesRevision: ExamenPaciente[] }) => {

        console.log('✅ Respuesta completa del back:', res);

        const lista = res.pacientesRevision || [];

        console.log('📌 Lista de pacientes:', lista);

        this.datos = lista.map((p) => {
          const autorizaciones = p.examenesPendientes?.autorizaciones || [];

          const texto = autorizaciones
            .map(a => `${a.tipoEvento} - ${a.descripcion}`)
            .join('\n');

          return {
            ...p,
            examenesPendientesTexto: texto
          };
        });

        this.datosFiltrados = [...this.datos];

        // ✅ Guardamos copia original
        this.datosOriginales = {};
        this.datos.forEach((d) => {
          this.datosOriginales[d.cedula] = { ...d };
        });
      },

      error: (err) =>
        console.error('❌ Error al obtener listado de exámenes del paciente:', err)
    });
  }

  cambiarFecha() {
    const fecha = new Date(this.fechaSeleccionada);
    this.cargarExamenes(fecha);
  }

  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(
      (d) =>
        d.cedula.includes(f) ||
        d.nombre.toLowerCase().includes(f)
    );
  }

  // Detectar los cambios y crear el payload
  guardarCambios() {
    const usuario = this.AuthService.getUser();

    const cambios = this.datos.filter((paciente) => {
      const original = this.datosOriginales[paciente.cedula];
      return (
        original &&
        (original.estado !== paciente.estado ||
         original.observación !== paciente.observación)
      );
    });

    const payload = cambios.map((p) => ({
      idCiclo: this.datosOriginales[p.cedula]?.idCicloPaciente || null,
      fecha: this.fechaActual,
      usuarioModificacion: usuario,
      estado: p.estado,
      observacion: p.observación
    }));

    if (payload.length === 0) {
      alert('No hay cambios para guardar.');
      return;
    }

    console.log('📤 Payload a enviar:', payload);

    this.miServicio.asignarRevisionExamenesCiclo(payload).subscribe({
      next: (res) => {
        console.log('✅ Cambios guardados en el servidor:', res);
        // Actualizar la copia original con los nuevos valores
        cambios.forEach((p) => {
          this.datosOriginales[p.cedula] = { ...p };
        });
        alert('Cambios guardados correctamente ✅');
      },
      error: (err) =>{
        console.error('❌ Error al guardar los cambios en el servidor:', err)
        alert('❌ Error al guardar los cambios');
      }
    });
  }
}

