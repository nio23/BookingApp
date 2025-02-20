import { Component, inject, signal } from '@angular/core';
import { CalendarComponent } from "../../calendar/calendar.component";
import { AppointmentsService } from '../../_services/appointment.service';
import { Appointment } from '../../_models/appointment';
import { CommonModule } from '@angular/common';
import { MyAppointmentsListComponent } from '../../my-appointments/my-appointments-list/my-appointments-list.component';
import { MyAppointment } from '../../_models/myAppointment';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CalendarComponent, CommonModule, MyAppointmentsListComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  appointmentService = inject(AppointmentsService);
  //schedule: Appointment[] = this.appointmentService.appointments();

  schedule = <Appointment[] | MyAppointment[]>[];

  loadSchedule(date: Date){
    const filteredAppointments = this.appointmentService.appointments().filter(x => new Date(x.date).getDate() === date.getDate());
    this.schedule = filteredAppointments;
    console.log('Filtering appointments by date');
  }
}
