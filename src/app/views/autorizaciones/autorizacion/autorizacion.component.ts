import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { CommonModule } from '@angular/common';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteResponseDto } from '../../../models/paciente';


@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrl: './autorizacion.component.css',
  imports: [
    FormsModule, CommonModule,
    TablaDinamicaComponent
],
})
export class AutorizacionComponent {
  constructor(
    private router: Router,
    private miServicio: GestionPacientesService,
    private AuthService: AuthService,
    private route: ActivatedRoute
  ) {}

  paciente = '';
  identificacion = '';
  protocolo = '';
  eps = '';

  pacienteData!: PacienteResponseDto;

  tipoOpciones = ['Individual', 'Universal']; 
  tipoSeleccionado = 'Individual';

  columnasIndividual = [
    { key: 'Medicamento', label: 'Medicamento' },
    { key: 'Presentacion', label: 'Presentación' },
    { key: 'Dosis', label: 'Dosis' },
    { key: 'Unidad', label: 'Unidad' }
  ];

  columnasUniversal = [
    { key: 'Medicamento', label: 'Medicamento' },
    { key: 'Presentacion', label: 'Presentación' },
    { key: 'Dosis', label: 'Dosis' },
    { key: 'Unidad', label: 'Unidad' },
    { key: 'Autorizacion', label: 'No. Autorización', tipo: 'text' },
    { key: 'Fecha', label: 'Fecha', tipo: 'fecha' }
  ];

  datos = [
    {
      Medicamento: '1',
    },
    {
      Medicamento: '2',
    },
    {
      Medicamento: '3',

    }
  ];

  ngOnInit() {
    this.cargaDatos()
  }

  cargaDatos(){
    this.identificacion = this.route.snapshot.paramMap.get('cedula') || '';
    
    this.miServicio.getPacienteCompletoByDocumento(this.identificacion)
      .subscribe({
        next: (resp) => {
          console.log('Paciente desde backend:', resp);

          if (resp.success && resp.data) {
            this.pacienteData = resp.data;

            const p = resp.data;

            // ahora el backend ya trae nombre completo y identificacion
            this.paciente = this.pacienteData.nombreCompleto;
            this.identificacion = this.pacienteData.identificacion;
            this.protocolo = this.pacienteData.protocoloActual?.nombreProtocolo || '';
            this.eps = this.pacienteData.eps;       
          }
        },
        error: (err) => {
          console.error('Error al obtener paciente:', err);
        }
      });
  }

  volver() {
    this.router.navigate(['autorizaciones/busquedaAU'])
  }

  Cancelar() {

  }

  Guardar() {

  }

}
