import { Component } from '@angular/core';
import { BuscadorComponent } from '../../../components/buscador/buscador.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-busqueda-au',
  templateUrl: './busqueda-au.component.html',
  styleUrl: './busqueda-au.component.css',
  imports: [
    RouterModule,
    BuscadorComponent
  ]
})
export class BusquedaAUComponent {
  constructor(private router: Router) {}

  filtrarPorCedula(cedula: string) {
    // lógica para filtrar o llamar API
    console.log('Buscar cédula:', cedula);
    this.router.navigate(['/autorizaciones/busquedaAU/Autorizacion']);
  }
}
