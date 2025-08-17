import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolosService } from '../../../services/protocolos.service';

@Component({
  selector: 'app-inf-protocolo',
  imports: [CommonModule, FormsModule],
  templateUrl: './inf-protocolo.component.html',
  styleUrl: './inf-protocolo.component.css'
})
export class InfProtocoloComponent {
  constructor(
    private router: Router,
    private protocoloService: ProtocolosService,
    private route: ActivatedRoute
  ){}

  nombreProtocolo: string = '';
  descripcion: string = '';
  medicamentos = [{ nombre: '', dosis: '', formula: '', duracion: { horas: '', minutos: '' } }];

  opcionesFormula = ['SC', 'Peso', 'AUC', 'Fija'];
  listaMedicamentos: string[] = [];

  id: string = '';

  ngOnInit(): void {
    // Ejemplo: obtener protocolo por ID desde la URL
    const protocolo = this.protocoloService.getProtocolo();
    if (protocolo) {
      this.id = protocolo.id;

      this.nombreProtocolo = protocolo.nombreProtocolo || '';
      this.descripcion = protocolo.descripcion || '';
      this.medicamentos = protocolo.medicamentos?.length > 0
        ? protocolo.medicamentos.map((m: any) => ({
            nombre: m.nombre || '',
            dosis: m.dosis || '',
            formula: m.formula || '',
            duracion: {
              horas: m.duracion ? Math.floor(m.duracion / 60).toString() : '',
              minutos: m.duracion ? (m.duracion % 60).toString() : ''
            }
          }))
        : [{ nombre: '', dosis: '', formula: '', duracion: { horas: '', minutos: '' } }];
    }

    // Obtener lista de medicamentos disponibles
    this.protocoloService.getMedicamentos().subscribe({
      next: (data) => {
        this.listaMedicamentos = data.map((med: any) => med.nombre);
      },
      error: (err) => {
        console.error('Error cargando medicamentos:', err);
      }
    });
  }

  agregarMedicamento() {
    this.medicamentos.push({ nombre: '', dosis: '', formula: '', duracion: { horas: '', minutos: '' } });
  }

  eliminarMedicamento(index: number) {
    this.medicamentos.splice(index, 1);
  }

  esFormularioValido(): boolean {
    if (!this.nombreProtocolo || !this.descripcion) {
      return false;
    }

    for (let medicamento of this.medicamentos) {
      if (
        medicamento.nombre === '' ||
        medicamento.dosis === '' ||
        medicamento.formula === '' ||
        medicamento.duracion.horas === '' ||
        medicamento.duracion.minutos === ''
      ) {
        return false;
      }
    }

    return true;
  }

  async siguiente() {
    if (!this.nombreProtocolo.trim() || !this.descripcion.trim()) {
      alert('Por favor completa el nombre y la descripción del protocolo.');
      return;
    }

    const medicamentosInvalidos = this.medicamentos.some(med =>
      !med.nombre || !med.dosis || !med.formula 
    );

    if (medicamentosInvalidos) {
      alert('Por favor completa todos los campos de los medicamentos.');
      return;
    }

    try {
      const protocolo = this.protocoloService.getProtocolo();

      const payload = {
        ...protocolo,
        nombreProtocolo: this.nombreProtocolo,
        descripcion: this.descripcion,
        medicamentos: this.medicamentos.map(m => ({
          ...m,
          duracion: (parseInt(m.duracion.horas) * 60) + parseInt(m.duracion.minutos) // minutos totales
        }))
      };

      this.protocoloService.setProtocolo(protocolo.id, payload);

      this.router.navigate(['admin-sistema/Protocolo/Info-Protocolo/Info-Ciclo'], {
        state: { protocolo }
      });

    } catch (error) {
      console.error('Error al verificar el nombre del protocolo:', error);
      alert('Ocurrió un error al verificar el nombre del protocolo. Intenta nuevamente.');
    }
  }

  listaMedicamentosFiltrada(index: number): string[] {
    const medicamentosSeleccionados = this.medicamentos
      .map((m, i) => i !== index ? m.nombre : null) // excluye el actual
      .filter(nombre => nombre); // quita null/empty

    return this.listaMedicamentos.filter(med => !medicamentosSeleccionados.includes(med));
  }

  volver() {
    this.router.navigate(['admin-sistema']);
  }
}
