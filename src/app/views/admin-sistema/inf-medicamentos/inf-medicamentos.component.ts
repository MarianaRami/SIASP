import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProtocolosService } from '../../../services/protocolos.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-inf-medicamentos',
  imports: [
    FormsModule, CommonModule
  ],
  templateUrl: './inf-medicamentos.component.html',
  styleUrl: './inf-medicamentos.component.css'
})
export class InfMedicamentosComponent implements OnInit {
  datosRecibidos: any;
  datosTabla: any[] = [];

  columnas: { key: string, label: string, tipo?: string }[] = [
    { key: 'dia', label: 'Día de Aplicación' }
  ];

  constructor(
    private router: Router,
    private AuthService: AuthService,
    private ProtocolosService: ProtocolosService
  ) {}

  ngOnInit(): void {
    this.datosRecibidos = this.ProtocolosService.getProtocolo();

    console.log('Datos recibidos:', this.datosRecibidos);

    this.generarColumnas();
    this.generarDatosTabla();
  }

  volver() {
    this.router.navigate(['admin-sistema/Nuevo-protocolo/Info-Protocolo/Info-Ciclo']);
  }

  generarColumnas() {
    if (this.datosRecibidos?.medicamentos) {
      this.datosRecibidos.medicamentos.forEach((med: any, index: number) => {
        this.columnas.push({
          key: `medicamento_${index}`,
          label: `${med.nombre} (${med.dosis})`,
          tipo: 'checkbox'
        });
      });
    }
  }

  generarDatosTabla() {
    if (this.datosRecibidos) {
      const eventosAplicacion = this.datosRecibidos.eventos?.filter((e: any) => 
        e.evento.toLowerCase() === 'aplicacion'
      ) || [];
      const configuracion = this.datosRecibidos.configuracionMedicamentos || [];

      eventosAplicacion.forEach((evento: any) => {
        const fila: any = {
          ciclo: this.datosRecibidos.numeroCiclo,
          dia: parseInt(evento.dia)
        };

        const configDia = configuracion.find((c: any) => 
          parseInt(c.dia) === parseInt(evento.dia)
        );

        // Inicializar checkboxes en false
        this.datosRecibidos.medicamentos.forEach((med: any, index: number) => {
          const medKey = `medicamento_${index}`;
          fila[medKey] = configDia?.medicamentos?.some(
            (m: any) => m.nombre === med.nombre && m.dosis == med.dosis
          ) || false;
        });

        this.datosTabla.push(fila);
      });
    }
  }

  crearNuevaVersion() {
    const protocolo = this.datosRecibidos;
    const usuario = this.AuthService.getUser();

    const configuracionMedicamentos = this.datosTabla.map(fila => {
      const medicamentosSeleccionados: any[] = [];

      this.datosRecibidos.medicamentos.forEach((med: any, index: number) => {
        if (fila[`medicamento_${index}`]) {
          medicamentosSeleccionados.push({
            nombre: med.nombre,
            dosis: parseInt(med.dosis)
          });
        }
      });

      return {
        dia: parseInt(fila.dia),
        medicamentos: medicamentosSeleccionados
      };
    });

    const payload = {
      nombreProtocolo: protocolo.nombreProtocolo,
      descripcion: protocolo.descripcion,
      usuarioCreacion: usuario, 
      medicamentos: protocolo.medicamentos,
      numeroCiclo: parseInt(protocolo.numeroCiclo),
      duracionCiclo: parseInt(protocolo.duracionCiclo),
      necesitaExamenes: protocolo.necesitaExamenes,
      eventos: protocolo.eventos,
      configuracionMedicamentos: configuracionMedicamentos
    };
    console.log(payload);

    this.ProtocolosService.crearNuevaVersionProtocoloCompleto(payload).subscribe({
      next: (res) => {
        console.log("✅ Nueva versión creada:", res);
        alert(res.message || "¡Nueva versión del protocolo creada con éxito!");
        this.router.navigate(['/admin-sistema']); 
        this.ProtocolosService.clearProtocolo();
      },
      error: (err) => {
        console.error("❌ Error al crear nueva versión:", err);
        alert(err.error?.message || "Ocurrió un error al crear la nueva versión del protocolo");
      }
    });
  }
}



