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
  @Output() guardar = new EventEmitter<any[]>();

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

    this.medicamentos = this.medicamentos.map(m => ({
      ...m,
      duracion: {
        horas: m.duracion ? Math.floor(m.duracion / 60).toString() : '',
        minutos: m.duracion ? (m.duracion % 60).toString() : ''
      }
    }));
  }

  estaEnRango(fila: any): boolean {
    const dosisCalculada = Number(fila.dosisCalculada);
    const dosisFormulada = Number(fila.dosisFormulada);
    if (isNaN(dosisFormulada) || isNaN(dosisCalculada)) return false;
    const margen = dosisCalculada * 0.05;
    return dosisFormulada >= (dosisCalculada - margen) && dosisFormulada <= (dosisCalculada + margen);
  }

  tieneFueraDeRango(): boolean {
    return this.medicamentos.some(fila => !this.estaEnRango(fila));
  }

  agregarFila() {
    this.medicamentos.push({
      nombre: '',
      dosisTeorica: '',
      dosisCalculada: '',
      dosisFormulada: '',
      formula: '',
      duracion: { horas: 0, minutos: 0 },
      esNueva: true
    });
  }

  emitirGuardar() {
    const datosEnviar = this.medicamentos.map(med => ({
      nombre: med.nombre,
      dosisFormulada: med.dosisFormulada,
      formula: med.formula,
      dosisTeorica: med.dosisTeorica,
      dosisCalculada: med.dosisCalculada,
      duracion: (Number(med.duracion.horas || 0) * 60) + Number(med.duracion.minutos || 0)
    }));

    this.guardar.emit(datosEnviar);
  }

  eliminarFila(index: number) {
    this.medicamentos.splice(index, 1);
  }

  volver() {
    this.cerrar.emit();
  }

  irASiguiente() {
    if (this.tieneFueraDeRango()) {
      const continuar = confirm(
        'Algunos medicamentos están fuera del rango permitido.\n\n¿Desea continuar de todas formas?'
      );

      if (!continuar) {
        // Solo se cierra la alerta y sigue en el pop-up
        return;
      }
    }

    const datosEnviar = this.medicamentos.map(med => ({
      nombre: med.nombre,
      dosisFormulada: med.dosisFormulada,
      formula: med.formula,
      dosisTeorica: med.dosisTeorica,
      dosisCalculada: med.dosisCalculada,
      duracion: (Number(med.duracion.horas || 0) * 60) + Number(med.duracion.minutos || 0)
    }));

    // Emitir siempre si llegó aquí (ya sea porque está en rango o eligió continuar)
    this.siguiente.emit(datosEnviar);
    console.log('Datos enviados al componente padre:', datosEnviar);
  }

  esFilaValida(fila: any): boolean {
    if (fila.esNueva) {
      return !!fila.nombre && !!fila.dosisTeorica && !!fila.dosisCalculada && !!fila.dosisFormulada && !!fila.formula;
    }
    return !!fila.dosisFormulada && !!fila.formula;
  }

  esFormularioValido(): boolean {
    return this.medicamentos.every(fila => this.esFilaValida(fila));
  }
}
