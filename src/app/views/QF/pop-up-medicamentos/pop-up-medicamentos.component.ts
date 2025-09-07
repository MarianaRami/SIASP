import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProtocolosService } from '../../../services/protocolos.service';


@Component({
  selector: 'app-pop-up-medicamentos',
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './pop-up-medicamentos.component.html',
  styleUrl: './pop-up-medicamentos.component.css'
})
export class PopUpMedicamentosComponent {
  @Input() medicamentos: any[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() siguiente = new EventEmitter<any[]>(); 

  listaMedicamentos: string[] = [];

  opcionesFormula = [
    { label:'SC', value: 'SC' }, 
    { label:'Peso', value: 'peso' }, 
    { label:'AUC', value: 'AUC' }, 
    { label:'Fija', value: 'fija' }
  ];

  constructor(private protocoloService: ProtocolosService) {}

  ngOnInit() {
    this.protocoloService.getMedicamentos().subscribe({
      next: (data) => {
        this.listaMedicamentos = data.map((med: any) => med.nombre);
      },
      error: (err) => {
        console.error('Error cargando medicamentos:', err);
      }
    });
  }

  estaEnRango(fila: any): boolean {
    const dosisCalculada = Number(fila.dosisCalculada);
    const dosisFormulada = Number(fila.dosisFormulada);
    if (isNaN(dosisFormulada) || isNaN(dosisCalculada)) return false;
    const margen = dosisCalculada * 0.05;
    return dosisFormulada >= (dosisCalculada - margen) && dosisFormulada <= (dosisCalculada + margen);
  }

  agregarFila() {
    this.medicamentos.push({
      nombre: '',
      dosisTeorica: '',
      dosisCalculada: '',
      dosisFormulada: '',
      formula: '',
      esNueva: true
    });
  }

  eliminarFila(index: number) {
    this.medicamentos.splice(index, 1);
  }

  volver() {
    this.cerrar.emit();
  }

  irASiguiente() {
    const datosEnviar = this.medicamentos.map(med => ({
      nombre: med.nombre ,
      dosisFormulada: med.dosisFormulada,
      formula: med.formula,
      dosisTeorica: med.dosisTeorica
    }));
    this.siguiente.emit(datosEnviar);
  }

  esFilaValida(fila: any): boolean {
    // Solo valida si es nueva
    if (fila.esNueva) {
      return !!fila.nombre && !!fila.dosisTeorica && !!fila.dosisCalculada && !!fila.dosisFormulada && !!fila.formula;
    }
    // Para las filas no nuevas, solo dosisFormulada y formula son editables
    return !!fila.dosisFormulada && !!fila.formula;
  }

  esFormularioValido(): boolean {
    return this.medicamentos.every(fila => this.esFilaValida(fila));
  }
}
