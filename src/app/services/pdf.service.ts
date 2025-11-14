import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  async generarPDF(columnas: any[], datos: any[], titulo: string, paciente: any) {
    const doc = new jsPDF();

    // === 🔹 Título principal (más arriba y menos espacio) ===
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 105, 15, { align: 'center' });

    // === 🔹 Información del paciente (más cerca del título) ===
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let infoY = 28; // antes estaba en 50 → demasiado abajo
    const lineHeight = 6; // antes 7 → menos espacio entre líneas

    doc.text(`Paciente: ${paciente.nombre || ''}`, 15, infoY);
    doc.text(`Identificación: ${paciente.identificacion || ''}`, 15, infoY + lineHeight);
    doc.text(`Protocolo: ${paciente.protocolo || ''}`, 15, infoY + lineHeight * 2);
    doc.text(`Médico tratante: ${paciente.medico || ''}`, 15, infoY + lineHeight * 3);
    doc.text(`Teléfono: ${paciente.telefono1 || ''} ${paciente.telefono2 ? ' - ' + paciente.telefono2 : ''}`, 15, infoY + lineHeight * 4);

    // === 🔹 Tabla con los eventos ===
    const tableStartY = infoY + lineHeight * 6 + 3;

    const headers = columnas.map(col => col.label);
    const rows = datos.map(d => columnas.map(col => d[col.key] || ''));

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: tableStartY,
      styles: { fontSize: 8 },           // → más compacto
      margin: { top: 10, left: 10, right: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // === 🔹 Descargar PDF ===
    doc.save(`${titulo}_${paciente.identificacion}.pdf`);
  }
}
