import { Component, inject } from '@angular/core';
import { CalendarComponent } from "../../calendar/calendar.component";
import { AppointmentsService } from '../../_services/appointment.service';
import { Appointment } from '../../_models/appointment';
import { CommonModule } from '@angular/common';
import { MyAppointmentsListComponent } from '../../my-appointments/my-appointments-list/my-appointments-list.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CalendarComponent, CommonModule, MyAppointmentsListComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  appointmentService = inject(AppointmentsService);
  schedule: Appointment[] = [];

  loadSchedule(date: Date){
    this.appointmentService.getAppointmentsByDate(date).subscribe({
      next: appointments => {
        this.schedule = appointments;
      },
      error: error => {
        console.log(error);
      },
      complete: () => console.log('Schedule has been loaded!')
    });
  }
}
