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

    this.generarColumnas();
    this.generarDatosTabla();
  }

  volver() {
    this.router.navigate(['admin-sistema/Nuevo-protocolo/Info-Ciclo']);
  }

  generarColumnas() {
    if (this.datosRecibidos?.medicamentos) {
      this.datosRecibidos.medicamentos.forEach((med: any, index: number) => {
        this.columnas.push({
          key: `medicamento_${index}`,
          label: med.nombre,
          tipo: 'checkbox'
        });
      });
    }
  }

  generarDatosTabla() {
    if (this.datosRecibidos) {
      const eventosAplicacion = this.datosRecibidos.eventos?.filter((e: any) => e.evento === 'Aplicación') || [];
      const configuracion = this.datosRecibidos.configuracionMedicamentos || [];

      eventosAplicacion.forEach((evento: any) => {
        const fila: any = {
          ciclo: this.datosRecibidos.numeroCiclo,
          dia: `${evento.dia}`
        };

        const configDia = configuracion.find((c: any) => c.dia === evento.dia);

        // Inicializar checkboxes en false
        this.datosRecibidos.medicamentos.forEach((med: any, index: number) => {
          const medKey = `medicamento_${index}`;
          fila[medKey] = configDia?.medicamentos?.includes(med.nombre) || false;
        });

        this.datosTabla.push(fila);
      });
    }
  }

  crearNuevaVersion() {
    const protocolo = this.datosRecibidos;

    const usuario = this.AuthService.getUser();

    const payload = {
      nombreProtocolo: protocolo.nombreProtocolo,
      usuarioCreacion: usuario, 
      medicamentos: protocolo.medicamentos,
      numeroCiclo: protocolo.numeroCiclo,
      duracionCiclo: protocolo.duracionCiclo,
      necesitaExamenes: protocolo.necesitaExamenes,
      eventos: protocolo.eventos,
      configuracionMedicamentos: protocolo.configuracionMedicamentos
    };
    console.log(payload)

    this.ProtocolosService.crearNuevaVersionProtocoloCompleto(payload).subscribe({
      next: (res) => {
        console.log("✅ Nueva versión creada:", res);
        alert(res.message || "¡Nueva versión del protocolo creada con éxito!");
        this.router.navigate(['/admin-sistema/protocolos']); // cambia esto si querés redirigir a otro lugar
      },
      error: (err) => {
        console.error("❌ Error al crear nueva versión:", err);
        alert(err.error?.message || "Ocurrió un error al crear la nueva versión del protocolo");
      }
    });
  }
}



