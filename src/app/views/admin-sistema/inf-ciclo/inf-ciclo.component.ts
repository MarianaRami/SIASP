import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolosService } from '../../../services/protocolos.service';

@Component({
  selector: 'app-inf-ciclo',
  imports: [ CommonModule, FormsModule],
  templateUrl: './inf-ciclo.component.html',
  styleUrl: './inf-ciclo.component.css'
})
export class InfCicloComponent {
  constructor(
    private router: Router, 
    private ProtocolosService: ProtocolosService,
    private route: ActivatedRoute,
) {}
  

  numeroCiclo: string = '';
  duracionCiclo: string = '';
  necesitaExamenes: boolean = false;

  id: string = '';

  eventos: any[] = [
    { dia: '', evento: '', observacion: '', activo: true }
  ];

  opcionesEvento = ['Exámenes', 'Aplicación', 'Otro'];

  ngOnInit(): void {
    const protocolo = this.ProtocolosService.getProtocolo();
    console.log("---------: ",protocolo)

    if (protocolo) {
      this.id = protocolo.id;

      this.numeroCiclo = protocolo.numeroCiclo || '';
      this.duracionCiclo = protocolo.duracionCiclo || '';
      this.necesitaExamenes = protocolo.necesitaExamenes || false;

      this.eventos = (protocolo.eventos?.filter((e: any) => e.activo) || this.eventos).map((evento: any) => {
      const eventoCapitalizado = this.capitalizarEvento(evento.evento);
      return {
        ...evento,
        evento: eventoCapitalizado
      };
    });
    }
  }

  agregarFila() {
    this.eventos.push({ dia: '', evento: '', observacion: '', activo: true });
  }

  eliminarFila(index: number) {
    this.eventos.splice(index, 1);
  }

  siguiente() {
    const protocolo = this.ProtocolosService.getProtocolo();

    const payload = {
      ...protocolo,
      numeroCiclo: this.numeroCiclo,
      duracionCiclo: this.duracionCiclo,
      necesitaExamenes: this.necesitaExamenes,
      eventos: this.eventos
    };

    this.ProtocolosService.setProtocolo(protocolo.id, payload);

    const ciclo = {
      numeroCiclo: this.numeroCiclo,
      duracionCiclo: this.duracionCiclo,
      necesitaExamenes: this.necesitaExamenes,
      eventos: this.eventos
    };

      this.router.navigate(
      ['admin-sistema/Protocolo/Info-Ciclo/Info-Medicamentos'],
      { state: { ciclo } }
    );
  }

  volver() {
    this.router.navigate(['admin-sistema/Protocolo', this.id]);
  }

  nuevoprotocolo(protocolo: any) {
    const payload = {
      nombreProtocolo: protocolo.nombreProtocolo,
      version: protocolo.version,
      fechaCreacion: protocolo.fechaCreacion,
      usuarioCreacion: protocolo.usuarioCreacion,
      medicamentos: protocolo.medicamentos,
      numeroCiclo: this.numeroCiclo,
      duracionCiclo: this.duracionCiclo,
      necesitaExamenes: this.necesitaExamenes,
      eventos: this.eventos,
      configuracionMedicamentos: protocolo.configuracionMedicamentos
    };
  }

  capitalizarEvento(evento: string): string {
    if (!evento) return '';

    const normalizado = evento.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // quita tildes
    const lower = normalizado.toLowerCase();

    switch (lower) {
      case 'examenes': return 'Exámenes';
      case 'aplicacion': return 'Aplicación';
      case 'otro': return 'Otro';
      default: return evento; // en caso de que venga algo inesperado
    }
  }

}
