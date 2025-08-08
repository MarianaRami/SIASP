import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProtocolosService } from '../../../services/protocolos.service';

@Component({
  selector: 'app-conf-medicamentos',
  imports: [FormsModule, CommonModule],
  templateUrl: './conf-medicamentos.component.html',
  styleUrl: './conf-medicamentos.component.css'
})
export class ConfMedicamentosComponent {
  datosRecibidos: any;

  columnas: { key: string, label: string, tipo?: string }[] = [
    { key: 'dia', label: 'Día de Aplicación' }
  ];

  datosTabla: any[] = [];

  constructor(
    private router: Router,
    private AuthService: AuthService,
    private ProtocolosService: ProtocolosService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.datosRecibidos = navigation?.extras?.state?.['payload'];
    console.log(this.datosRecibidos);

    this.generarColumnas();
    this.generarDatosTabla();
  }

  volver() {
    this.router.navigate(['admin-sistema/Nuevo-protocolo/Conf-Ciclo'],
      { state: { protocolo: this.datosRecibidos } }
    );
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
      const eventosAplicacion = this.datosRecibidos.eventos.filter((e: any) => e.evento === 'Aplicación');

      eventosAplicacion.forEach((evento: any) => {
        const fila: any = {
          dia: `${evento.dia}`
        };

        // Inicializar checkboxes en false
        this.datosRecibidos.medicamentos.forEach((_: any, index: number) => {
          fila[`medicamento_${index}`] = false;
        });

        this.datosTabla.push(fila);
      });
    }
  }

  esFormularioValido(): boolean {
    // Verificar que cada fila tenga al menos un medicamento seleccionado
    for (let fila of this.datosTabla) {
      const tieneAlMenosUno = this.datosRecibidos.medicamentos.some((_: any, index: number) => {
        return fila[`medicamento_${index}`] === true;
      });

      if (!tieneAlMenosUno) {
        return false;
      }
    }

    return true;
  }


  Guardar() {
    if (!this.esFormularioValido()) {
      alert('Por favor selecciona al menos un medicamento por día de aplicación y completa todos los campos del protocolo.');
      return;
    }

    const datosRecibidos = this.datosRecibidos;

    // Crear estructura con medicamentos seleccionados por día
    const configuracionMedicamentos = this.datosTabla.map(fila => {
      const medicamentosSeleccionados: string[] = [];

      this.datosRecibidos.medicamentos.forEach((_: any, index: number) => {
        if (fila[`medicamento_${index}`]) {
          medicamentosSeleccionados.push(this.datosRecibidos.medicamentos[index].nombre);
        }
      });

      return {
        dia: fila.dia,
        medicamentos: medicamentosSeleccionados
      };
    });

    const usuario = this.AuthService.getUser();

    // Construir el payload final incluyendo la tabla
    const payload = {
      nombreProtocolo: datosRecibidos.nombreProtocolo,
      usuarioCreacion: usuario,
      descripción: datosRecibidos.descripcion,
      medicamentos: datosRecibidos.medicamentos,
      numeroCiclo: datosRecibidos.numeroCiclo,
      duracionCiclo: datosRecibidos.duracionCiclo,
      necesitaExamenes: datosRecibidos.necesitaExamenes,
      eventos: datosRecibidos.eventos,
      configuracionMedicamentos 
    };

    console.log("Esto son los datos finales",payload)

    // ✅ Guardar en backend
    this.ProtocolosService.saveProtocolo(payload).subscribe({
      next: (respuesta) => {
        console.log('✅ Protocolo guardado exitosamente:', respuesta);
        this.router.navigate(['admin-sistema']); // Redirigir luego de guardar
      },
      error: (err) => {
        console.error('❌ Error al guardar protocolo:', err);
        alert('Ocurrió un error al guardar el protocolo.');
      }
    });
  }

}


