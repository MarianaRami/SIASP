import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProtocolosService } from '../../../services/protocolos.service';

@Component({
  selector: 'app-datos-nv-protocolo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-nv-protocolo.component.html',
  styleUrl: './datos-nv-protocolo.component.css'
})
export class DatosNvProtocoloComponent {
  constructor(private router: Router, private protocoloService: ProtocolosService) {
    const navigation = this.router.getCurrentNavigation();
    const protocolo = navigation?.extras?.state?.['protocolo'];

    if (protocolo) {
      this.nombreProtocolo = protocolo.nombreProtocolo || '';
      this.descripcion = protocolo.descripcion || '';
      this.medicamentos = protocolo.medicamentos?.length > 0
        ? protocolo.medicamentos
        : [{ nombre: '', dosis: '', formula: '', duracion: { horas: '', minutos: '' } }];
    }

    this.protocoloService.getMedicamentos().subscribe({
      next: (data) => {
        this.listaMedicamentos = data.map(med => med.nombre); 
      },
      error: (err) => {
        console.error('Error cargando medicamentos:', err);
      }
    });
  }

  nombreProtocolo: string = '';
  descripcion: string = '';
  medicamentos = [{ nombre: '', dosis: '', formula: '', duracion: { horas: '', minutos: '' } }];

  opcionesFormula = [
    { label:'SC', value: 'SC' }, 
    { label:'Peso', value: 'peso' }, 
    { label:'AUC', value: 'AUC' }, 
    { label:'Fija', value: 'fija' }
  ];
  listaMedicamentos: string[] = [];

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
      const respuesta = await this.protocoloService.existeProtocoloPorNombre(this.nombreProtocolo).toPromise();

      if (respuesta?.existe) {
        alert('Ya existe un protocolo con este nombre. Por favor elige otro.');
        return;
      }

      const protocolo = {
        nombreProtocolo: this.nombreProtocolo,
        descripcion: this.descripcion,
        medicamentos: this.medicamentos
      };

      this.router.navigate(['admin-sistema/Nuevo-protocolo/Conf-Ciclo'], {
        state: { protocolo }
      });

    } catch (error) {
      console.error('Error al verificar el nombre del protocolo:', error);
      alert('Ocurrió un error al verificar el nombre del protocolo. Intenta nuevamente.');
    }
  }

  volver() {
    this.router.navigate(['admin-sistema']);
  }
}


