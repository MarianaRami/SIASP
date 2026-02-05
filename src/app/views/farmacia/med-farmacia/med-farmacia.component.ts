import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '../../../components/tabla-dinamica/tabla-dinamica.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GestionPacientesService } from '../../../services/gestion-pacientes.service';

@Component({
  selector: 'app-med-farmacia',
  templateUrl: './med-farmacia.component.html',
  styleUrl: './med-farmacia.component.css',
  imports: [
    TablaDinamicaComponent,
    CommonModule, FormsModule
  ]
})
export class MedFarmaciaComponent {
  constructor(
    private router: Router,
    private gestionService: GestionPacientesService
  ) {}

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cedula' },
    { key: 'ubicación', label: 'Ubicación' },
    { key: 'medicamento', label: 'Medicamento' },
    { key: 'dosis', label: 'Dosis'},
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'ciclo', label: 'Ciclo' },
    { key: 'dia', label: 'Día' }
  ];

  datos: any[] = [];
  datosFiltrados: any[] = [];
  datosOriginales: { [cedula: string]: any } = {};

  filtro: string = '';

  obtenerFechaHoy(): string {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0]; // yyyy-mm-dd
}

  fechaSeleccionada: string = this.obtenerFechaHoy();

  changeDateToGMTMinus5(date: Date): Date {
    const utcMillis = date.getTime() + date.getTimezoneOffset() * 60000;
    const gmtMinus5Millis = utcMillis + (6 * 60) * 60000;
    return new Date(gmtMinus5Millis);
  }

  ngOnInit() {
   this.cargarDatos();
  }

  cargarDatos() {
    const tipoPacienteLower = this.tipoPaciente.toLowerCase();

    this.gestionService
      .getOrdenesFarmacia(
        this.fechaSeleccionada,
        tipoPacienteLower,
        this.tipoOrden
      )
      .subscribe({
        next: (res) => {
          const filas: any[] = [];

          res.ordenes.forEach((orden: any) => {
            orden.medicamentos.forEach((med: any) => {
              filas.push({
                nombre: orden.nombrePaciente,
                cedula: orden.documento,
                ubicación: orden.ubicacion,
                medicamento: med.nombrePresentacionMedicamento,
                dosis: med.viaPresentacion,
                cantidad: med.cantidad,
                ciclo: orden.nombreProtocolo,
                dia: this.fechaSeleccionada
              });
            });
          });

          this.datos = filas;
          this.datosFiltrados = [...filas];
        },
        error: (err) =>
          console.error('Error cargando órdenes de farmacia:', err)
      });
  }



  filtrarDatos() {
    const f = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter(d =>
      d['cedula']?.toLowerCase().includes(f) ||
      d['nombre']?.toLowerCase().includes(f)
    );
  }

  tipoPaciente: 'AMBULATORIO' | 'HOSPITALIZADO' = 'AMBULATORIO';
  tipoOrden: string = 'NO_OP';


  volver() {
    this.router.navigate(['programacion/menuConfirmacion']);
  }

  descarga() {
    if (!this.datosFiltrados.length) return;

    const normalize = (texto: any) =>
      (texto ?? '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'N');

    // XML header
    let xml = `
    <?xml version="1.0"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">

      <Styles>
        <!-- Estilo para encabezados -->
        <Style ss:ID="HeaderStyle">
          <Font ss:Bold="1"/>
          <Interior ss:Color="#D9D9D9" ss:Pattern="Solid"/> 
          <Borders>
            <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
          </Borders>
        </Style>

        <!-- Estilo para celdas normales -->
        <Style ss:ID="CellStyle">
          <Borders>
            <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
          </Borders>
        </Style>
      </Styles>

      <Worksheet ss:Name="Datos">
        <Table>
    `;

    // Encabezados
    xml += `<Row>`;
    for (const col of this.columnas) {
      xml += `<Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${normalize(col.label)}</Data></Cell>`;
    }
    xml += `</Row>`;

    // Filas
    for (const fila of this.datosFiltrados) {
      xml += `<Row>`;
      for (const col of this.columnas) {
        const value = normalize(fila[col.key] ?? "");
        xml += `<Cell ss:StyleID="CellStyle"><Data ss:Type="String">${value}</Data></Cell>`;
      }
      xml += `</Row>`;
    }

    xml += `
        </Table>
      </Worksheet>
    </Workbook>
    `;

    // Descargar como archivo .xls (Excel lo abre perfecto)
    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "medicamentos.xls";
    a.click();

    URL.revokeObjectURL(url);
  }

  // sin diseño en la tabla 
  /*
  descarga() {
  if (!this.datosFiltrados.length) return;

  // Función para quitar tildes y caracteres raros
  const normalize = (texto: any) =>
    (texto ?? '')
      .toString()
      .normalize('NFD')                // separa letras + acentos
      .replace(/[\u0300-\u036f]/g, '') // elimina acentos
      .replace(/ñ/g, 'n')              // ñ → n
      .replace(/Ñ/g, 'N');             // Ñ → N

  // Encabezados (sin tildes)
  const headers = this.columnas
    .map(c => normalize(c.label))
    .join(';');

  // Filas
  const rows = this.datosFiltrados.map(fila =>
    this.columnas
      .map(col => normalize(fila[col.key]))
      .join(';')
  );

  // CSV final
  const csvContent = [headers, ...rows].join('\n');

  // Descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'medicamentos.csv';
  a.click();

  URL.revokeObjectURL(url);
}

  */


}
