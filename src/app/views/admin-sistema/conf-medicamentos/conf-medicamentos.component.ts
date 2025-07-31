import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
    private AuthService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.datosRecibidos = navigation?.extras?.state?.['payload'];
    console.log(this.datosRecibidos);

    this.generarColumnas();
    this.generarDatosTabla();
  }

  volver() {
    this.router.navigate(['admin-sistema/Nuevo-protocolo']);
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

  Guardar() {
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

    // Construir el payload final incluyendo la tabla
    const payload = {
      nombreProtocolo: datosRecibidos.nombreProtocolo,
      descripción: datosRecibidos.descripcion,
      medicamentos: datosRecibidos.medicamentos,
      numeroCiclo: datosRecibidos.numeroCiclo,
      duracionCiclo: datosRecibidos.duracionCiclo,
      necesitaExamenes: datosRecibidos.necesitaExamenes,
      eventos: datosRecibidos.eventos,
      configuracionMedicamentos // ✅ Aquí va la tabla con los checks
    };

    console.log("Esto son los datos finales",payload)

    // ✅ Guardar en backend
    this.AuthService.saveProtocolo(payload).subscribe({
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


