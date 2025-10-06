import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { FormsModule } from '@angular/forms';

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
  view: CalendarView = CalendarView.Month; // fijo a mes
  viewDate: Date = new Date();

  events = [
    { start: new Date(), title: 'Paciente: Juan Pérez' },
    { start: new Date(new Date().setDate(new Date().getDate() + 2)), title: 'Paciente: María López' }
  ];

  dayClicked({ day }: { day: any }): void {
    console.log('Día seleccionado:', day.date, day.events);
  }
}
