import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BuscadorComponent } from '../../../components/buscador/buscador.component';

@Component({
  selector: 'app-busqueda-pro',
  templateUrl: './busqueda-pro.component.html',
  styleUrl: './busqueda-pro.component.css',
  imports: [
    BuscadorComponent,
    RouterModule,
  ]
})
export class BusquedaProComponent {
  constructor(private router: Router) {}

  filtrarPorCedula(cedula: string) {
    // lógica para filtrar o llamar API
    console.log('Buscar cédula:', cedula);
    this.router.navigate(['/programacion/busquedaPro/historial']);
  }
}
