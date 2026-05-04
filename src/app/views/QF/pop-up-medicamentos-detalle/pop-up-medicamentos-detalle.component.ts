import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { MedicamentoParaPresentacionDto, CombinacionOptima, MedicamentoPresentacionResponse } from '../../../models/descripcion-medicamentos';
import { PopupMotivoComponent } from '../../../components/popup-motivo/popup-motivo.component';
import { MotivoDevolucion } from '../pop-up-medicamentos/pop-up-medicamentos.component';

@Component({
  standalone: true,
  selector: 'app-pop-up-medicamentos-detalle',
  imports: [FormsModule, CommonModule, PopupMotivoComponent],
  templateUrl: './pop-up-medicamentos-detalle.component.html',
  styleUrl: './pop-up-medicamentos-detalle.component.css'
})
export class PopUpMedicamentosDetalleComponent {
  @Input() infoCiclo: any; 
  @Output() cerrar = new EventEmitter<void>();
  @Output() siguiente = new EventEmitter<any>();
  @Output() pendiente = new EventEmitter<any>();

  filasTabla: any[] = [];

  presentaciones: any[] = [];
  resultados: any[] = [];

  mostrarPopupMotivo = false;
  datosPendientes: any = null;

  motivosDevolucion = [
    { value: MotivoDevolucion.ERROR_FORMULACION_MEDICAMENTO, label: 'Error en formulación del medicamento' },
    { value: MotivoDevolucion.ERROR_DIGITACION_MEDICAMENTO, label: 'Error en digitación del medicamento' },
    { value: MotivoDevolucion.ERROR_FORMULACION_MEDICAMENTO_PROG, label: 'Error en formulación en programación' }
  ];

  constructor(private gestionPacientesService: GestionPacientesService) {}

  ngOnInit() {
    if (!this.infoCiclo) return;

    console.log("Info recibida en el popup:", this.infoCiclo);

    //Ordena de manera descendente y toma el primer ciclo no finalizado
    
    //idCicloActivo = this.infoCiclo.ciclos?.sort((a: any, b: any) => b.numCiclo - a.numCiclo)
      //         .find((ciclo: any) => ciclo.estado !== 'finalizado')?.id || ""; 
               
    let payload: MedicamentoParaPresentacionDto;
    if(this.infoCiclo.ciclos.length === 0){
      // Construimos el payload en la forma de MedicamentoParaPresentacionDto sin idCiclo{
        payload = {
        medicamentos: this.infoCiclo.medicamentos.map((m: any) => ({
          nombre: m.nombre,
          dosisFormulada: m.dosisFormulada,
          formula: m.formula,
          dosisTeorica: m.dosisTeorica
        })),
        diaConfiguracionMedicamentos: this.infoCiclo.configuracionMedicamentos.map((conf: any) => ({
          dia: conf.dia,
          medicamentos: conf.medicamentos.map((med: any) => ({
            nombre: med.nombre,
            dosisTeorica: med.dosis
          }))
        }))
      };
    }else{
    // Construimos el payload en la forma de MedicamentoParaPresentacionDto
      let idCicloActivo = this.infoCiclo.ciclos[0]?.id || "";
      payload = {
        idCiclo: idCicloActivo,
        medicamentos: this.infoCiclo.medicamentos.map((m: any) => ({
          nombre: m.nombre,
          dosisFormulada: m.dosisFormulada,
          formula: m.formula,
          dosisTeorica: m.dosisTeorica
        })),
        diaConfiguracionMedicamentos: this.infoCiclo.configuracionMedicamentos.map((conf: any) => ({
          dia: conf.dia,
          medicamentos: conf.medicamentos.map((med: any) => ({
            nombre: med.nombre,
            dosisTeorica: med.dosis
          }))
        }))
      };
    }

    console.log("Payload enviado al servicio:", payload);

    this.gestionPacientesService.createPacienteMedicamentoPresentacion(payload)
      .subscribe({
        next: (resp: any) => {
          console.log('Respuesta del servicio:', resp);
          this.resultados = resp.resultados
        },
        error: (err) => {
          console.error('Error al obtener presentaciones:', err);
        }
      });
  }


  eliminarFila(index: number) {
    this.infoCiclo.splice(index, 1);
  }

  volver() {
    this.cerrar.emit();
  }

  onConfirmarMotivo(event: { motivo?: string; observaciones?: string }) {
    this.mostrarPopupMotivo = false;

    this.pendiente.emit({
      data: this.datosPendientes,
      motivo: event.motivo,
      observaciones: event.observaciones
    });
  }

  cerrarMotivo() {
    this.mostrarPopupMotivo = false;
  }

  guardar() {
    // Transformamos resultados antes de emitir
    const transformados = this.resultados.map((med: any) => ({
      nombre: med.nombre,
      dosisTotal: med.dosisTotal,
      dosisTeorica: med.dosisTeorica,
      presentaciones: med.presentaciones.map((pres: any) => ({
        nombrePresentacion: pres.nombrePresentacion,
        cantidadPorAplicacion: pres.cantidadPorAplicacion,
        cantidadPorCiclo: pres.cantidadPorCiclo
      }))
    }));

    console.log('Datos transformados para enviar:', transformados);
    this.siguiente.emit(transformados);
  }

  borrador() {
    const transformados = this.resultados.map((med: any) => ({
      nombre: med.nombre,
      dosisTotal: med.dosisTotal,
      dosisTeorica: med.dosisTeorica,
      presentaciones: med.presentaciones.map((pres: any) => ({
        nombrePresentacion: pres.nombrePresentacion,
        cantidadPorAplicacion: pres.cantidadPorAplicacion,
        cantidadPorCiclo: pres.cantidadPorCiclo
      }))
    }));

    this.datosPendientes = transformados;
    this.mostrarPopupMotivo = true; 
  }
}
