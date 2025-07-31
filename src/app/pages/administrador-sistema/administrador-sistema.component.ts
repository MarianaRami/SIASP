import { CommonModule, NgFor } from '@angular/common';
import { Component, Version } from '@angular/core';
import { TablaDinamicaComponent } from '../../components/tabla-dinamica/tabla-dinamica.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-examenes',
  standalone: true,
  templateUrl: './administrador-sistema.component.html',
  styleUrls: ['./administrador-sistema.component.css'],
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class AdministradorSistemaComponent {
  constructor(private authService: AuthService, private router: Router) {}

  columnas = [
    { key: 'Protocolo', label: 'Protocolo' },
    { key: 'Versión', label: 'Versión'},
    { key: 'Fecha', label: 'Fecha Creación'},
    { key: 'Estado', label: 'Estado'},
    { key: 'boton', label: '', tipo: 'button'}
  ];
  
  datos: any[] = [];

  filtro: string = '';
  datosFiltrados = [...this.datos];
  mostrarInactivos = true;

  ngOnInit(): void {
  this.authService.getProtocolos().subscribe({
    next: (data) => {
      this.datos = data.map((protocolo: any) => ({
        Protocolo: protocolo.nombre,
        'Versión': protocolo.version,
        'Fecha': new Date(protocolo.fechaCreacion).toLocaleDateString(), // Formato legible
        Estado: protocolo.estado,
        boton: 'Ver' // o el texto que desees en el botón
      }));
      this.datosFiltrados = [...this.datos];
      console.log('Protocolos transformados:', this.datos);
    },
    error: (error) => {
      console.error('Error al obtener protocolos', error);
    }
  });
}

  agregar(){
    this.router.navigate(['admin-sistema/Nuevo-protocolo']);
  }

  handleBuscar(fila: any) {
    console.log('Protocolo recibida:', fila.Protocolo);  
    this.router.navigate(['admin-sistema/Protocolo'])
  }

  filtrarDatos() {
    if (this.mostrarInactivos) {
      this.datosFiltrados = this.datos;
    } else {
      this.datosFiltrados = this.datos.filter(d => d.Estado !== 'Inactivo');
    }
  }

}
