import { Component } from '@angular/core';
import { BuscadorComponent } from '../../../components/buscador/buscador.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css',
  imports: [
    RouterModule,
    BuscadorComponent
  ]
})
export class BusquedaComponent {
  constructor(private router: Router) {}

  filtrarPorCedula(cedula: string) {
    // lógica para filtrar o llamar API
    console.log('Buscar cédula:', cedula);
    this.router.navigate(['/qf/busqueda/paciente']);
  }
}
