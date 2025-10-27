import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule],
  templateUrl: './calendario-pacientes.component.html',
  styleUrls: ['./calendario-pacientes.component.css']
})
export class CalendarioPacientesComponent {
  currentDate = new Date();
  calendarDays: (Date | null)[] = [];

  constructor(private router: Router) {
    this.generateCalendar();
  }

  volver() {
      this.router.navigate(['programacion/calendario']);
    }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay(); // 0 = domingo, 1 = lunes, ...
    if (startDay === 0) startDay = 7; // hacemos que domingo sea el último día

    this.calendarDays = [];

    // Espacios vacíos antes del primer día real
    for (let i = 1; i < startDay; i++) {
      this.calendarDays.push(null);
    }

    // Días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.calendarDays.push(new Date(year, month, i));
    }
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  openDay(day: Date | null) {
    if (!day) return;
    const dateString = day.toISOString().split('T')[0];
    this.router.navigate(['/programacion/calendario/reporte', dateString]);
  }
}

