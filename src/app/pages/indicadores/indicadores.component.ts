import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndicadoresService } from '../../services/indicadores';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-indicadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './indicadores.component.html',
  styleUrl: './indicadores.component.css'
})
export class IndicadoresComponent {

  constructor(private indicadoresService: IndicadoresService) {}

  // 🔹 FILTROS
  fechaInicio: string = '';
  fechaFin: string = '';
  documento: string = '';

  chart: any;

  tipoReporte: string = 'errores';

  // 🔹 DATA
  data: any[] = [];

  cargando = false;

  // 🔹 SELECT DE REPORTES
  reportes = [
    { value: 'errores', label: 'Errores de medicamentos' },
    { value: 'auditoria', label: 'Auditoría paciente' },
    { value: 'oportunidad', label: 'Oportunidad inicio' },
    { value: 'cambio', label: 'Cambio protocolo' },
    { value: 'fallecidos', label: 'Fallecidos / desistidos' },
    { value: 'ocupacion', label: 'Ocupación sillas' },
    { value: 'toxicidad', label: 'Toxicidad' }
  ];

  buscar() {

    if (!this.fechaInicio || !this.fechaFin) {
      alert('Debes seleccionar fechas');
      return;
    }

    this.cargando = true;

    const bodyFechas = {
      fechaIni: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    const bodyAuditoria = {
      documento: this.documento,
      fechaIni: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    let request$;

    switch (this.tipoReporte) {

      case 'errores':
        request$ = this.indicadoresService.getErroresMedicamentos(bodyFechas);
        break;

      case 'auditoria':
        request$ = this.indicadoresService.getAuditoriaPaciente(bodyAuditoria);
        break;

      case 'oportunidad':
        request$ = this.indicadoresService.getOportunidadInicio(bodyFechas);
        break;

      case 'cambio':
        request$ = this.indicadoresService.getCambioProtocolo(bodyFechas);
        break;

      case 'fallecidos':
        request$ = this.indicadoresService.getFallecidos(bodyFechas);
        break;

      case 'ocupacion':
        request$ = this.indicadoresService.getOcupacionSillas(bodyFechas);
        break;

      case 'toxicidad':
        request$ = this.indicadoresService.getToxicidad(bodyFechas);
        break;

      default:
        return;
    }

    request$.subscribe({
      next: (res) => {
        this.data = res;
        this.cargando = false;

        this.generarGrafica(); // 🔥 AQUI
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  crearGrafica(labels: string[], data: number[]) {

    setTimeout(() => {

      const canvas = document.getElementById('graficaIndicadores') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');

      if (!ctx) return;

      this.chart = new Chart(ctx, {
        type: this.tipoReporte === 'fallecidos' ? 'pie' : 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Cantidad',
            data
          }]
        },
        options: {
          responsive: true
        }
      });

    }, 0);
  }

  generarGrafica() {
    if (this.chart) {
      this.chart.destroy();
    }

    let labels: string[] = [];
    let data: number[] = [];

    switch (this.tipoReporte) {

      // 🔴 ERRORES
      case 'errores':
        const erroresMap: any = {};

        this.data.forEach(e => {
          erroresMap[e.tipoError] = (erroresMap[e.tipoError] || 0) + 1;
        });

        labels = Object.keys(erroresMap);
        data = Object.values(erroresMap);
        break;

      // 🔵 AUDITORÍA
      case 'auditoria':
        const auditoriaMap: any = {};

        this.data.forEach(e => {
          auditoriaMap[e.tipoEvento] = (auditoriaMap[e.tipoEvento] || 0) + 1;
        });

        labels = Object.keys(auditoriaMap);
        data = Object.values(auditoriaMap);
        break;

      // 🟡 OPORTUNIDAD
      case 'oportunidad':
        labels = this.data.map(d => d.nombrePaciente);
        data = this.data.map(d => d.diasDiferencia);
        break;

      // 🟣 CAMBIO PROTOCOLO
      case 'cambio':
        const cambioMap: any = {};

        this.data.forEach(e => {
          cambioMap[e.tipoEvento] = (cambioMap[e.tipoEvento] || 0) + 1;
        });

        labels = Object.keys(cambioMap);
        data = Object.values(cambioMap);
        break;

      // ⚫ FALLECIDOS
      case 'fallecidos':
        const estadoMap: any = {};

        this.data.forEach(e => {
          estadoMap[e.estado] = (estadoMap[e.estado] || 0) + 1;
        });

        labels = Object.keys(estadoMap);
        data = Object.values(estadoMap);
        break;

      // 🟢 OCUPACIÓN
      case 'ocupacion':
        labels = this.data.map(d => d.nombre);
        data = this.data.map(d => d.porcentajeOcupacion);
        break;

      // 🔶 TOXICIDAD
      case 'toxicidad':
        const toxMap: any = {};

        this.data.forEach(e => {
          toxMap[e.razonReprogramacion] = (toxMap[e.razonReprogramacion] || 0) + 1;
        });

        labels = Object.keys(toxMap);
        data = Object.values(toxMap);
        break;
    }

    this.crearGrafica(labels, data);
  }

  descargarExcel() {
    if (!this.data || this.data.length === 0) return;

    const normalize = (texto: any) =>
      (texto ?? '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'N');

    const columnas = Object.keys(this.data[0]);

    let xml = `
    <?xml version="1.0"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
              xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">

      <Styles>
        <Style ss:ID="HeaderStyle">
          <Font ss:Bold="1"/>
          <Interior ss:Color="#D9D9D9" ss:Pattern="Solid"/>
        </Style>

        <Style ss:ID="CellStyle"/>
      </Styles>

      <Worksheet ss:Name="Indicadores">
        <Table>
    `;

    // 🔹 HEADERS
    xml += `<Row>`;
    columnas.forEach(col => {
      xml += `<Cell ss:StyleID="HeaderStyle">
                <Data ss:Type="String">${normalize(col)}</Data>
              </Cell>`;
    });
    xml += `</Row>`;

    // 🔹 FILAS
    this.data.forEach(row => {
      xml += `<Row>`;
      columnas.forEach(col => {
        const value = normalize(row[col]);
        xml += `<Cell ss:StyleID="CellStyle">
                  <Data ss:Type="String">${value}</Data>
                </Cell>`;
      });
      xml += `</Row>`;
    });

    xml += `
        </Table>
      </Worksheet>
    </Workbook>
    `;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `indicadores_${this.tipoReporte}.xls`;
    a.click();

    URL.revokeObjectURL(url);
  }
}