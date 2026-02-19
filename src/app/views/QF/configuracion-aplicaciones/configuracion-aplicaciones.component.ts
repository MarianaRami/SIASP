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

    const payload = {
      nombreProtocolo: this.infoCicloCompleta.nombreProtocolo,
      version: this.infoCicloCompleta.version,
      descripcion: this.infoCicloCompleta.descripcion,
      observacion: this.infoCicloCompleta.observacion || undefined,
      fechaCreacion: this.infoCicloCompleta.fechaCreacion,
      numero_ciclos: this.infoCicloCompleta.numero_ciclos,
      usuarioCreacion: usuario,
      eventos: this.infoCicloCompleta.eventos,
      numeroCiclo: this.infoCicloCompleta.numeroCiclo,
      ciclos: this.infoCicloCompleta.ciclos,
      configuracionMedicamentos: this.infoCicloCompleta.configuracionMedicamentos,
      indicadores: {
          id_ind_ciclo_paciente: this.infoCicloCompleta.indicadores.id_ind_ciclo_paciente,
          //idProtocoloPaciente: this.infoCicloCompleta.indicadores,
          peso: Number(this.infoCicloCompleta.indicadores.peso),
          talla: Number(this.infoCicloCompleta.indicadores.talla),
          sc: Number(this.infoCicloCompleta.indicadores.sc),
          tfg: Number(this.infoCicloCompleta.indicadores.tfg),
          fecha: this.infoCicloCompleta.indicadores.fecha
      },
      medicamentos: this.infoCicloCompleta.medicamentos,
      fechaConsulta: this.infoCicloCompleta.fechaConsulta,
      fecha_inicio_estimada: this.infoCicloCompleta.fecha_inicio_estimada ? new Date(this.infoCicloCompleta.fecha_inicio_estimada) : null,
      conciliacionMedicamentos: this.infoCicloCompleta.conciliacionMedicamentos,
      presentaciones: this.infoCicloCompleta.presentaciones,
      idPaciente: this.infoCicloCompleta.idPaciente,
      idProtocoloPaciente: this.infoCicloCompleta.idProtocoloPaciente,
      estado: this.infoCicloCompleta.estado
    }

    this.cicloPacienteService.createCicloPaciente(payload).subscribe({
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

  /*guardarBorrador(datos: any) {
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
  }*/

  guardarBorrador(datos: any) {
  this.mostrarPopupMedicamentosDetalle = false;
  this.infoCicloCompleta.presentaciones = datos;

  // Construir el objeto a enviar basado en infoCicloCompleta
  let protocoloFinal: any = {};

  // IDs principales
  protocoloFinal.idProtocoloPaciente = this.infoCicloCompleta.idProtocoloPaciente || '';
  protocoloFinal.idPaciente = this.infoCicloCompleta.idPaciente || '';

  // Configuración de medicamentos
  let config_meds: {dia: number, medicamentos: {nombre: string, dosis: number}[]}[] = [];
  
  if (this.infoCicloCompleta.configuracionMedicamentos) {
    for (const confmed of this.infoCicloCompleta.configuracionMedicamentos) {
      let medsConf = confmed.medicamentos || [];
      let meds: {nombre: string, dosis: number}[] = [];
      
      for (const med of medsConf) {
        meds.push({
          nombre: med.nombre || '',
          dosis: Number(med.dosis) || 0
        });
      }

      config_meds.push({
        dia: Number(confmed.dia) || 0,
        medicamentos: meds
      });
    }
  }

  protocoloFinal.configuracionMedicamentos = config_meds;

  // Datos del protocolo
  protocoloFinal.descripcion = this.infoCicloCompleta.descripcion || '';
  protocoloFinal.numeroCiclo = this.infoCicloCompleta.numeroCiclo || 1;
  protocoloFinal.numero_ciclos = this.infoCicloCompleta.numero_ciclos || 0;
  protocoloFinal.nombreProtocolo = this.infoCicloCompleta.nombreProtocolo || '';
  protocoloFinal.version = this.infoCicloCompleta.version || 1;
  protocoloFinal.fechaCreacion = this.infoCicloCompleta.fechaCreacion || new Date().toISOString();
  protocoloFinal.ciclos = this.infoCicloCompleta.ciclos || [];

  // Indicadores
  if (this.infoCicloCompleta.indicadores) {
    protocoloFinal.indicadores = {
      id_ind_ciclo_paciente: this.infoCicloCompleta.indicadores.id_ind_ciclo_paciente,
      peso: Number(this.infoCicloCompleta.indicadores.peso) || 0,
      sc: Number(this.infoCicloCompleta.indicadores.sc) || 0,
      tfg: Number(this.infoCicloCompleta.indicadores.tfg) || 0,
      talla: Number(this.infoCicloCompleta.indicadores.talla) || 0,
      fecha: this.infoCicloCompleta.indicadores.fecha
    };
  }

  // Fechas
  protocoloFinal.fechaConsulta = this.infoCicloCompleta.fechaConsulta || '';
  protocoloFinal.fecha_inicio_estimada = this.infoCicloCompleta.fecha_inicio_estimada || '';

  // Medicamentos y conciliación
  protocoloFinal.conciliacionMedicamentos = this.infoCicloCompleta.conciliacionMedicamentos || false;
  protocoloFinal.medicamentos = this.infoCicloCompleta.medicamentos || [];

  // Eventos
  protocoloFinal.eventos = this.infoCicloCompleta.eventos || [];

  // Presentaciones
  protocoloFinal.presentaciones = this.infoCicloCompleta.presentaciones || [];

  // Estado y usuario
  protocoloFinal.estado = 'borrador';
  
  const usuario = this.AuthService.getUser();
  protocoloFinal.usuarioCreacion = usuario ? usuario : 'desconocido';

  console.log("✅ Guardando borrador:", protocoloFinal);

  this.cicloPacienteService.createCicloPaciente(protocoloFinal).subscribe({
    next: (resp) => {
      console.log('✅ Ciclo creado como borrador:', resp);
      this.router.navigate(['qf/busqueda']);
      alert('Configuración guardada como borrador exitosamente.');
    },
    error: (err) => {
      console.error('❌ Error creando ciclo:', err);
      alert('Error al guardar el borrador. Por favor, intente nuevamente.');
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

