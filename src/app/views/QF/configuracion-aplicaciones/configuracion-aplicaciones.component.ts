import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PopUpMedicamentosDetalleComponent } from '../pop-up-medicamentos-detalle/pop-up-medicamentos-detalle.component';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';

@Component({
  selector: 'app-configuracion-aplicaciones',
  imports: [
    PopUpMedicamentosDetalleComponent,
    CommonModule, FormsModule
  ],
  templateUrl: './configuracion-aplicaciones.component.html',
  styleUrl: './configuracion-aplicaciones.component.css'
})
export class ConfiguracionAplicacionesComponent implements OnInit {
  infoCicloCompleta: any;
  columnas: { key: string, label: string, tipo?: string }[] = [
    { key: 'dia', label: 'Día de Aplicación' }
  ];
  datosTabla: any[] = [];

  medicamentosDetalle: any[] = [];

  cedula!: string;

  mostrarPopupMedicamentos = false;
  mostrarPopupMedicamentosDetalle = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private cicloPacienteService: GestionPacientesService,
  ) {
    const nav = this.router.getCurrentNavigation();
    this.infoCicloCompleta = nav?.extras.state?.['info'];
    console.log('Información recibida:', this.infoCicloCompleta);
  }

  ngOnInit(): void {
    if (this.infoCicloCompleta) {
      this.generarColumnas();
      this.generarDatosTabla();
    }
  }

  generarColumnas() {
    if (this.infoCicloCompleta?.medicamentos) {
      this.infoCicloCompleta.medicamentos.forEach((med: any, index: number) => {
        this.columnas.push({
          key: `medicamento_${index}`,
          label: `${med.nombre} (${med.dosisTeorica})`,
          tipo: 'checkbox'
        });
      });
    }
  }

  generarDatosTabla() {
    const eventosAplicacion = this.infoCicloCompleta.eventos?.filter(
      (e: any) => e.tipo.toLowerCase() === 'aplicacion'
    ) || [];

    const configuracion = this.infoCicloCompleta.configuracionMedicamentos || [];

    eventosAplicacion.forEach((evento: any) => {
      const fila: any = {
        ciclo: this.infoCicloCompleta.numeroCiclo,
        dia: parseInt(evento.dia)
      };

      const configDia = configuracion.find(
        (c: any) => parseInt(c.dia) === parseInt(evento.dia)
      );

      // Inicializar checkboxes en false
      this.infoCicloCompleta.medicamentos.forEach((med: any, index: number) => {
        const medKey = `medicamento_${index}`;
        fila[medKey] = configDia?.medicamentos?.some(
          (m: any) => m.nombre === med.nombre && parseFloat(m.dosis) == med.dosisTeorica
        ) || false;
      });

      this.datosTabla.push(fila);
    });
  }

  abrirPopupMedicamentosDetalle(datos: any[]) {
    this.mostrarPopupMedicamentosDetalle = true;
    this.medicamentosDetalle = datos; 
  }

  cerrarPopupMedicamentosDetalle() {
    this.mostrarPopupMedicamentosDetalle = false;
  }

  volver() {
    this.cedula = this.route.snapshot.paramMap.get('cedula') || '';
    this.router.navigate(['qf/busqueda/paciente', this.cedula,'conf-ciclo']);
  }

  abrirResumenFinal(datos: any) {
    this.mostrarPopupMedicamentosDetalle = false;
    this.infoCicloCompleta.presentaciones = datos;

    const usuario = this.AuthService.getUser();
    this.infoCicloCompleta.usuarioCreacion = usuario;

    this.infoCicloCompleta.estado = 'activo';

    console.log("✅ Configuración actualizada:", this.infoCicloCompleta);

    this.cicloPacienteService.createCicloPaciente(this.infoCicloCompleta).subscribe({
      next: (resp) => {
        console.log('✅ Ciclo creado:', resp);
        this.router.navigate(['qf/busqueda']);
        alert('Configuración guardada y ciclo activado exitosamente.');
      },
      error: (err) => {
        console.error('❌ Error creando ciclo:', err);
      }
    });

  }

  guardarBorrador(datos: any) {
    this.mostrarPopupMedicamentosDetalle = false;
    this.infoCicloCompleta.presentaciones = datos;

    const usuario = this.AuthService.getUser();
    this.infoCicloCompleta.usuarioCreacion = usuario;

    this.infoCicloCompleta.estado = 'borrador';

    console.log("✅ Configuración actualizada:", this.infoCicloCompleta);

    this.cicloPacienteService.createCicloPaciente(this.infoCicloCompleta).subscribe({
      next: (resp) => {
        console.log('✅ Ciclo creado:', resp);
        this.router.navigate(['qf/busqueda']);
        alert('Configuración guardada como borrador exitosamente.');
      },
      error: (err) => {
        console.error('❌ Error creando ciclo:', err);
      }
    });
  }

  Guardar() {
    const nuevaConfiguracion = this.datosTabla.map(fila => {
      const medicamentosSeleccionados: any[] = [];

      this.infoCicloCompleta.medicamentos.forEach((med: any, index: number) => {
        if (fila[`medicamento_${index}`]) {
          medicamentosSeleccionados.push({
            nombre: med.nombre,
            dosis: parseInt(med.dosisTeorica)
          });
        }
      });

      return {
        dia: parseInt(fila.dia),
        medicamentos: medicamentosSeleccionados
      };
    });

    this.infoCicloCompleta.configuracionMedicamentos = nuevaConfiguracion;

    this.abrirPopupMedicamentosDetalle(this.infoCicloCompleta); 
  }
}

