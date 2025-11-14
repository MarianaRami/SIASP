import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';
import { ProgramacionService } from '../../../services/programacion.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css',
  imports: [
      TablaDinamicaComponent,
      CommonModule, FormsModule
    ]
})
export class ConfirmacionComponent {

  constructor(
    private router: Router,
    private programacionServicio: ProgramacionService,
    private authService: AuthService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'telefonos', label: 'Telefono' },
    { key: 'estado', label: 'Estado', tipo: 'select', opciones: ['Confirmado', 'Reprogramar'] },
    { key: 'observacion', label: 'Observaciones', tipo: 'text' },
  ];

  datos: any[] = [];
  datosFiltrados: any[] = [];
  datosOriginales: { [cedula: string]: any } = {};

  filtro: string = '';
  fechaActual = new Date();

  ngOnInit() {
    this.programacionServicio.getlistadoPacientesConfirmacion().subscribe({
      next: (res) => {
        console.log('✅ Pacientes para confirmación:', res);

        this.datos = res.pacientesConf || [];
        this.datosFiltrados = [...this.datos];

        // Guardar copia original
        this.datosOriginales = {};
        this.datos.forEach(d => {
          this.datosOriginales[d.cedula] = { ...d };
        });
      },
      error: (err) => console.error('❌ Error al obtener pacientes para confirmación:', err)
    });
  }

  // -------------------------------
  // 🔍 FILTRO ARREGLADO
  // -------------------------------
  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
         d.cedula?.toLowerCase().includes(f)
      || d.nombre?.toLowerCase().includes(f)
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
      alert('No hay cambios para guardar');
      return;
    }

    // Crear payload según lo que necesita el back
    const payload = {confirmaciones: cambios.map((p) => ({
      idCiclo: this.datosOriginales[p.cedula]?.idCicloPaciente || null,
      idEvento: this.datosOriginales[p.cedula]?.idEventoPaciente || null,
      fecha: this.fechaActual,
      usuarioModificacion: usuario,
      estado: p.estado === 'Confirmado' ? 'confirmada' : 'reprogramacion',
      observacion: p.observacion
    }))};

    console.log("📤 Enviando payload:", payload);

    this.programacionServicio.confirmacionPaciente(payload).subscribe({
      next: (res) => {
        alert("Cambios guardados correctamente");
        console.log("✅ Respuesta:", res);

        // Actualizar copia original
        cambios.forEach(c => {
          this.datosOriginales[c.cedula] = { ...c };
        });
      },
      error: (err) => {
        console.error("❌ Error al guardar confirmación:", err);
        alert("Error al guardar");
      }
    });
  }

  volver() {
    this.router.navigate(['programacion']);
  }
}

