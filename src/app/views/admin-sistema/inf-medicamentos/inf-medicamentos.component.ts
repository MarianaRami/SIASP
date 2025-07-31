import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inf-medicamentos',
  imports: [
    TablaDinamicaComponent,
    FormsModule, CommonModule
  ],
  templateUrl: './inf-medicamentos.component.html',
  styleUrl: './inf-medicamentos.component.css'
})
export class InfMedicamentosComponent {
  datosRecibidos: any;

  columnas = [
    { key: 'ciclo', label: 'Ciclo' },
    { key: 'dia', label: 'Día de Aplicación' },
    { key: 'boton', label: 'Medicamentos', tipo: 'button' }
  ];

  datosTabla: any[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.datosRecibidos = navigation?.extras?.state?.['payload'];
    
    if (this.datosRecibidos) {
      this.generarTabla();
    }
  }
  
  volver() {
    this.router.navigate(['admin-sistema/Nuevo-protocolo']);
  }

  generarTabla() {
    const numCiclos = this.datosRecibidos?.ciclo?.numeroCiclo || 0;
    const eventos = this.datosRecibidos?.ciclo?.eventos || [];

    const eventosAplicacion = eventos.filter((e: any) =>
      e.evento?.toLowerCase() === 'Aplicación' || e.evento?.toLowerCase() === 'aplicacion'
    );

    const resultado: any[] = [];

    for (let ciclo = 1; ciclo <= numCiclos; ciclo++) {
      for (const ev of eventosAplicacion) {
        resultado.push({
          ciclo: ciclo,
          dia: ev.dia,
          boton: 'Medicamentos'
        });
      }
    }

    this.datosTabla = resultado;
    console.log(this.datosTabla)
  }

  manejarClickMedicamento(fila: any) {
    console.log('Fila seleccionada:', fila);
    // Aquí puedes abrir un popup, redirigir, etc.
  }

}
