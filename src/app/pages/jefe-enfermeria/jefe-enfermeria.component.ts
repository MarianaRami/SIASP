import { Component } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramacionService } from '../../services/programacion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-jefe-enfermeria',
  standalone: true,
  templateUrl: './jefe-enfermeria.component.html',
  styleUrls: ['./jefe-enfermeria.component.css'],
  imports: [TablaDinamicaComponent, CommonModule, FormsModule]
})
export class JefeEnfermeriaComponent {

  constructor(
    private programacionService: ProgramacionService,
    private authService: AuthService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'telefonos', label: 'Teléfono' },
    { key: 'observaciones', label: 'Observaciones' },
    { key: 'estado', label: 'Estado', tipo: 'select', opciones: ['Reprogramación', 'Cancelar protocolo'] }
  ];

  datos: any[] = [];
  datosFiltrados: any[] = [];
  datosOriginales: { [cedula: string]: any } = {};

  filtro: string = '';
  fechaActual = new Date();

  ngOnInit() {
    this.cargarPacientes();
  }

  // -------------------------------------------------
  // 🔹 Cargar pacientes (con servicio o dummy)
  // -------------------------------------------------
  cargarPacientes() {
    /*
    this.programacionService.getListadoPacientesJefeEnfermeria().subscribe({
      next: (res) => {
        this.datos = res.pacientes || [];
        this.datosFiltrados = [...this.datos];

        this.datosOriginales = {};
        this.datos.forEach(d => {
          this.datosOriginales[d.cedula] = { ...d };
        });
      },
      error: (err) => console.error('Error cargando pacientes jefe:', err)
    });
    */

    // -------------------------------------------------
    // Datos dummy mientras el backend está listo
    this.datos = [
      { nombre: 'Ana Ruiz', cedula: '12345678', telefonos: '3216549870', estado: '' },
      { nombre: 'Carlos Soto', cedula: '87654321', telefonos: '3123456789', estado: '' }
    ];
    this.datosFiltrados = [...this.datos];
    // -------------------------------------------------

    // Guardar copia original
    this.datosOriginales = {};
    this.datos.forEach(d => {
      this.datosOriginales[d.cedula] = { ...d };
    });
  }

  // -------------------------------------------------
  // 🔍 FILTRO
  // -------------------------------------------------
  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
      d.cedula?.toLowerCase().includes(f) ||
      d.nombre?.toLowerCase().includes(f)
    );
  }

  // -------------------------------------------------
  // 💾 GUARDAR CAMBIOS
  // -------------------------------------------------
  guardar() {
    const usuario = this.authService.getUser();

    const cambios = this.datos.filter((pac) => {
      const original = this.datosOriginales[pac.cedula];
      return original && original.estado !== pac.estado;
    });

    if (cambios.length === 0) {
      alert('No hay cambios para guardar');
      return;
    }

    const payload = {
      decisiones: cambios.map((p) => ({
        cedula: p.cedula,
        estado: p.estado === 'Reprogramación' ? 'reprogramacion' : 'cancelar_protocolo',
        fecha: this.fechaActual,
        usuarioModificacion: usuario
      }))
    };

    console.log('📤 Payload Jefe Enfermería:', payload);

    /*
    this.programacionService.registrarDecisionesJefe(payload).subscribe({
      next: (res) => {
        alert('Cambios guardados correctamente');
        cambios.forEach(c => {
          this.datosOriginales[c.cedula] = { ...c };
        });
      },
      error: (err) => {
        console.error('❌ Error al guardar decisiones:', err);
        alert('Error al guardar');
      }
    });
    */
  }

}

