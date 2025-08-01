import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component.spec';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-protocolos',
  imports: [
    CommonModule, FormsModule,
    TablaDinamicaComponent
  ],
  templateUrl: './protocolos.component.html',
  styleUrl: './protocolos.component.css'
})
export class ProtocolosComponent {
  protocolo: any = null; 
  protocoloId: string | null = null;
  
  constructor(
  private router: Router,
  private route: ActivatedRoute,
  private protocoloService: AuthService
  ) {}

  ngOnInit(): void {
    // Nos suscribimos a los parámetros de la ruta para obtener el ID dinámico
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID desde paramMap:', id);

      this.protocoloId = id;

      // Si el ID existe, llamamos al servicio para obtener los datos del protocolo
      if (this.protocoloId) {
        this.protocoloService.getProtocoloCompletoById(this.protocoloId).subscribe({
          next: (data) => {
            this.protocolo = data;
            this.transformarDatosParaTabla(data);
            console.log('Protocolo cargado:', data);
          },
          error: (error) => {
            console.error('Error al cargar el protocolo:', error);
          }
        });
      } else {
        console.warn('No se proporcionó un ID de protocolo en la ruta.');
      }
    });
  }


  columnas = [
    { key: 'dia', label: 'Día' },
    { key: 'evento', label: 'Evento' },
    { key: 'medicamentos', label: 'Medicamentos' }
  ];

  datos: any[] = [];

  transformarDatosParaTabla(data: any): void {
    const eventos = data.eventos || [];
    console.log(eventos)
    const configuracion = data.configuracionMedicamentos || [];

    this.datos = eventos
      .filter((evento: any) => evento.activo)
      .map((evento: any) => {
        const configDia = configuracion.find((c: any) => c.dia === evento.dia);
        const meds = (evento.evento === 'aplicación' && configDia)
          ? configDia.medicamentos.join(', ')
          : '-';

        return {
          dia: evento.dia,
          evento: evento.evento,
          medicamentos: meds
        };
      });
  }
  
  volver() {
    this.router.navigate(['admin-sistema'])
  }

  editar() {
    this.router.navigate(['admin-sistema/Protocolo/Info-Ciclo'])
  }

  desactivar() {

  }
}

