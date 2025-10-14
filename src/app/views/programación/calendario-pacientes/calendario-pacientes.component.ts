import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario-pacientes',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CalendarModule
  ],
  templateUrl: './calendario-pacientes.component.html',
  styleUrls: ['./calendario-pacientes.component.css']
})
export class CalendarioPacientesComponent {
  currentDate = new Date();
  montDays: Date[] = [];
  calendarDays: (Date | null)[] = [];

  constructor( private router: Router) { 
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Día de la semana del primer día (0 = domingo, 1 = lunes, ...)
    let startDay = firstDay.getDay();
    // Ajustamos para que la semana empiece en lunes
    //if (startDay === 0) startDay = 7;

    this.calendarDays = [];

    // Añadimos los días vacíos antes del inicio real del mes
    for (let i = 1; i < startDay; i++) {
      this.calendarDays.push(null);
    }

    // Añadimos los días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.calendarDays.push(new Date(year, month, i));
    }

    this.montDays = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      this.montDays.push(new Date(year, month, day));
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
    this.router.navigate(['/tabla-dia', dateString]);
  }
}
