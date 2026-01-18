import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramacionService } from '../../../services/programacion.service';

@Component({
  selector: 'app-reprogramacion',
  standalone: true,
  templateUrl: './reprogramacion.component.html',
  styleUrls: ['./reprogramacion.component.css'],
  imports: [TablaDinamicaComponent, CommonModule, FormsModule]
})
export class ReprogramacionComponent {

  constructor(
    private router: Router,
    private service: ProgramacionService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'protocolo', label: 'Protocolo' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'observacion', label: 'Motivo' },
    { key: 'accion', label: ' ', tipo: 'button' }
  ];

  datos: any[] = [];
  datosFiltrados: any[] = [];
  datosOriginales: { [cedula: string]: any } = {};

  filtro = '';

  ngOnInit() {
    this.cargarPacientes();
  }

  // ----------------------------------
  // 📥 Cargar pacientes reprogramación
  // ----------------------------------
  cargarPacientes() {
    this.service.getListadoPacientesReprogramacion().subscribe({
      next: (res) => {
        console.log('📋 Reprogramación:', res);

        this.datos = (res.pacientes || []).map((p: any) => ({
          nombre: p.nombre,
          cedula: p.documento,
          protocolo: p.nombreProtocolo, // ajusta si luego viene el nombre real
          fecha: new Date().toISOString().split('T')[0],
          observacion: p.observacion || '',
          idEvento: p.idEvento,
          idPaciente: p.idPaciente
        }));

        this.datosFiltrados = [...this.datos];

        // Copia original (como en enfermería)
        this.datosOriginales = {};
        this.datos.forEach(d => {
          this.datosOriginales[d.cedula] = { ...d };
        });
      },
      error: (err) => {
        console.error('❌ Error cargando reprogramación:', err);
      }
    });

    // 🔹 Dummy (solo para pruebas)
    /*
    this.datos = [
      {
        nombre: 'Juan Pérez',
        cedula: '123456789',
        protocolo: 'Protocolo A',
        fecha: '2025-05-20',
        observacion: 'Paciente no asistió'
      }
    ];
    this.datosFiltrados = [...this.datos];
    */
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
  // 🔘 BOTÓN DE ACCIÓN
  // -------------------------------
  handleBuscar(fila: any) {
    console.log('➡️ Ir a historial:', fila.cedula);
    this.router.navigate([
      '/programacion/busquedaPro/historial',
      fila.cedula
    ]);
  }

  volver() {
    this.router.navigate(['programacion']);
  }
}
