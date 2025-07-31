import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-datos-nv-protocolo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-nv-protocolo.component.html',
  styleUrl: './datos-nv-protocolo.component.css'
})
export class DatosNvProtocoloComponent implements OnInit {
  constructor(private router: Router, private protocoloService: AuthService) {}

  nombreProtocolo: string = '';
  descripcion: string = '';
  medicamentos = [{ nombre: '', dosis: '', formula: '' }];

  opcionesFormula = ['SC', 'Peso', 'TFG', 'Fija'];
  listaMedicamentos: string[] = [];

  ngOnInit(): void {
    this.protocoloService.getMedicamentos().subscribe({
      next: (data) => {
        this.listaMedicamentos = data.map(med => med.nombre); // ajusta según tu DTO
      },
      error: (err) => {
        console.error('Error cargando medicamentos:', err);
      }
    });
  }

  agregarMedicamento() {
    this.medicamentos.push({ nombre: '', dosis: '', formula: '' });
  }

  eliminarMedicamento(index: number) {
    this.medicamentos.splice(index, 1);
  }

  siguiente() {
    const protocolo = {
      nombreProtocolo: this.nombreProtocolo,
      descripcion: this.descripcion,
      medicamentos: this.medicamentos
    };

    this.router.navigate(['admin-sistema/Nuevo-protocolo/Conf-Ciclo'], { state: { protocolo } });
  }

  volver() {
    this.router.navigate(['admin-sistema']);
  }
}

