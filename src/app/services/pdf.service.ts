import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  generarPDF(columnas: any[], datos: any[], titulo: string) {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text(titulo, 14, 20);

    // Cabeceras y filas para autoTable
    const headers = columnas.map(col => col.label);
    const rows = datos.map(dato => columnas.map(col => dato[col.key]));

    // Crear tabla
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30
    });

    // Descargar PDF
    doc.save(`${titulo}.pdf`);
  }
}
