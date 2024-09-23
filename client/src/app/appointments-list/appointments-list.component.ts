import { Component, inject, OnInit } from '@angular/core';
import { AppointmentsService } from '../_services/appointment.service';
import { Appointment } from '../_models/appointment';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {
  private appointmentService = inject(AppointmentsService);
  private appointments: Appointment[] = [];
  schedule: Appointment[] = [];
  private closeTime = this.appointmentService.closeTime;
  private openTime = this.appointmentService.openTime;
  private appointmentTime = this.appointmentService.appointmentTime;
  
  constructor() {
    this.schedule = this.loadEmptySchedule();
    this.appointmentService.dateChanged.subscribe({
      next: () => {
        this.loadAppointments();
      }
    });
  }
  
  loadAppointments(){
    this.appointmentService.getAppointmentsByDate().pipe(
      map((appointments: Appointment[]): Appointment[] => {
        appointments.forEach(app => {
          const appointment = this.schedule.find(slot => this.getDayTimeOnMinutes(slot.date) === this.getDayTimeOnMinutes(new Date(app.date)));
          if (appointment) 
            appointment.clientName = app.clientName;
        });
        return this.schedule;
      }))
    .subscribe({
      next: appointments => {
        this.schedule = appointments;
        console.log(this.appointments);
      },
      error: error => {
        console.log(error);
        this.schedule = this.loadEmptySchedule();
      },
      complete: () => console.log('Request has completed')
    });
  }

  ngOnInit(): void {
    //this.loadAppointments();
  }


  loadEmptySchedule(): Appointment[] {
    const schedule:Appointment[] = [];
    const numberOfAppointmentsOnDay = (this.getDayTimeOnMinutes(this.closeTime) - this.getDayTimeOnMinutes(this.openTime))/this.appointmentTime;
    console.log(`Number of appointments on day: ${numberOfAppointmentsOnDay}`);
    for(let i = 0; i < numberOfAppointmentsOnDay; i++){
      const d = new Date(this.openTime);
      d.setMinutes(d.getMinutes()+this.appointmentTime * i);
      schedule.push({date: d, clientName: "" });
    }
    return schedule;
  }

  getDayTimeOnMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }


}
