import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { CombinacionOptima, MedicamentoPresentacionResponse } from '../../../models/descripcion-medicamentos';

@Component({
  selector: 'app-pop-up-medicamentos-detalle',
  imports: [FormsModule, CommonModule],
  templateUrl: './pop-up-medicamentos-detalle.component.html',
  styleUrl: './pop-up-medicamentos-detalle.component.css'
})
export class PopUpMedicamentosDetalleComponent {
  @Input() medicamentos: any[] = []; 
  @Output() cerrar = new EventEmitter<void>();
  @Output() siguiente = new EventEmitter<any>();

  filasTabla: any[] = [];

  presentaciones: any[] = [];

  constructor(private gestionPacientesService: GestionPacientesService) {}

  ngOnInit() {
    console.log("Medicamentos recibidos en el popup:", this.medicamentos);

    this.gestionPacientesService.createPacienteMedicamentoPresentacion(this.medicamentos)
      .subscribe({
        next: (resp: MedicamentoPresentacionResponse) => {
          //
          console.log('Respuesta del servicio:', resp);

          // transformar resultados → filas para la tabla
          this.filasTabla = resp.resultados.flatMap((resultado: any) =>
            resultado.combinacionOptima.map((combo: CombinacionOptima) => ({
              nombreMedicamento: resultado.nombreMedicamento,
              dosisTeorica: resultado.dosisTeorica,
              dosisRequerida: resultado.dosisRequerida,
              dosisFormulada: resultado.dosisTotal,
              formula: this.medicamentos.find(m => m.nombre === resultado.nombre)?.formula ?? '',
              presentacion: combo.nombre,
              cantidad: combo.cantidad
            }))
          );

          console.log("Filas de tabla transformadas:", this.filasTabla);
        },
        error: (err) => {
          console.error('Error al obtener presentaciones:', err);
        }
      });
  }


  eliminarFila(index: number) {
    this.medicamentos.splice(index, 1);
  }

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    console.log('Datos guardados:', this.filasTabla);
    this.siguiente.emit(this.filasTabla);
  }
}
