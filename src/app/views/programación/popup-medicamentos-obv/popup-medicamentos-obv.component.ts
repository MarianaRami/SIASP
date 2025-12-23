import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutorizacionesService } from '../../../services/autorizaciones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-popup-medicamentos-obv',
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './popup-medicamentos-obv.component.html',
  styleUrl: './popup-medicamentos-obv.component.css'
})
export class PopupMedicamentosObvComponent {
 @Output() cerrar = new EventEmitter<void>();
 @Output() guardarEvento = new EventEmitter<any>();

 constructor(
    private route: ActivatedRoute,
    private autorizacionesService: AutorizacionesService
 ){}

  observaciones: string = '';
  identificacion = '';

  medicamentos: any[] = [];

  ngOnInit() {
    this.cargaDatos()
  }

  cargaDatos(){
    this.identificacion = this.route.snapshot.paramMap.get('cedula') || '';

    this.autorizacionesService.getPacienteByDocumento(this.identificacion)
      .subscribe({
        next: (resp) => {
          console.log('Respuesta autorizaciones:', resp);

          //if (resp && resp.paciente) {
          if (resp) {
            // Cargar medicamentos en la tabla
            this.medicamentos = resp.medicamentos || [];
          }
        },
        error: (err) => {
          console.error('Error al obtener autorizaciones:', err);
        }
      });
  }

  volver() {
    this.cerrar.emit();
  }

  guardar() {
    console.log('Observaciones:', this.observaciones);
    console.log('Medicamentos:', this.medicamentos);
    this.guardarEvento.emit(this.observaciones);

    // Debería enviar idCiclo, idPaciente, observaciones , fecha y usuario modificador
  }

  cancelar() {
    this.cerrar.emit(); 
  }
}
