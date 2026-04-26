import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';

@Component({
  selector: 'app-borradores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './borradores.component.html',
  styleUrl: './borradores.component.css'
})
export class BorradoresComponent {

  constructor(private service: GestionPacientesService) {}

  fechaInicio: string = '';
  fechaFin: string = '';
  documento: string = '';

  tipo: 'errores' | 'auditoria' = 'errores';

  data: any[] = [];
  cargando = false;

  buscar() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Selecciona fechas');
      return;
    }

    this.cargando = true;

    this.service
      .getErroresMedicamentosGet(this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (res) => {
          // 👉 si quieres solo borradores
          this.data = res; // o filtrar si aplica
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
        }
      });
  }
}
