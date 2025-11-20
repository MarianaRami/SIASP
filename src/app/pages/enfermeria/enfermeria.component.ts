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
    { key: 'estado', label: 'Estado', tipo: 'select', opciones: ['Asistió', 'Suspendida', 'Reprogramar', 'Inasistencia'] },
    { key: 'observacion', label: 'Observaciones', tipo: 'text' }
  ];

  datos: any[] = [];
  datosFiltrados: any[] = [];
  datosOriginales: { [cedula: string]: any } = {};

  filtro: string = '';
  fechaActual = new Date();

  ngOnInit() {
    this.cargarPacientes();
  }

  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  cargarPacientes() {
    this.service.getlistadoEnfermeriaPaciente(this.formatearFecha(this.fechaActual)).subscribe({
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
   this.datos = [ { Nombre: 'Ana Ruiz', Cedula: '12345678', Teléfono: '3216549870', Estado: '', Observaciones: '' }, { Nombre: 'Carlos Soto', Cedula: '87654321', Teléfono: '3123456789', Estado: '', Observaciones: '' } ];
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

    const payload = {
      asistencias: cambios.map((p) => ({
        cedula: p.cedula,
        estado: p.estado,
        observacion: p.observacion,
        fecha: this.fechaActual,
        usuarioModificacion: usuario
      }))
    };

    console.log("📤 Enviando payload enfermería:", payload);
/*
    this.programacionService.registrarAsistencias(payload).subscribe({
      next: (res) => {
        alert("Cambios guardados correctamente");
        console.log("Respuesta backend:", res);

        // Actualizar copia original
        cambios.forEach(c => {
          this.datosOriginales[c.cedula] = { ...c };
        });
      },
      error: (err) => {
        console.error("❌ Error al guardar:", err);
        alert("Error al guardar la información");
      }
    });
    */
  }
}
