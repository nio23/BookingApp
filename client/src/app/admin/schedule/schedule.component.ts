import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarComponent } from "../../calendar/calendar.component";
import { AppointmentsService } from '../../_services/appointment.service';
import { Appointment } from '../../_models/appointment';
import { CommonModule } from '@angular/common';
import { MyAppointmentsListComponent } from '../../my-appointments/my-appointments-list/my-appointments-list.component';
import { MyAppointment } from '../../_models/myAppointment';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CalendarComponent, CommonModule, MyAppointmentsListComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent{
  appointmentService = inject(AppointmentsService);
  //$schedule = new Observable<Appointment[] | Appointment[]>();
  schedule = signal<Appointment[] | Appointment[]>([]);

  loadSchedule(date: Date){
    console.log("Loading schedule for date: ", date);
    this.appointmentService.getAppointmentsByDate(date).subscribe({
      next: appointments => {
        this.schedule.set(appointments);
      }
    });
    //this.schedule.set = this.appointmentService.getAppointmentsByDate(date);
  }
}
