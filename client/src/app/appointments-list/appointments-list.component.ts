import { Component, inject, OnInit } from '@angular/core';
import { AppointmentsService } from '../_services/appointment.service';
import { Appointment } from '../_models/appointment';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {
  private appointmentService = inject(AppointmentsService);
  appointments: Appointment[] = [];
  schedule: Date[] = [];
  private closeTime = this.appointmentService.closeTime;
  private openTime = this.appointmentService.openTime;
  private appointmentTime = this.appointmentService.appointmentTime;
  
  constructor() {
    this.schedule = this.loadSchedule();
    this.appointmentService.dateChanged.subscribe({
      next: () => {
        this.loadAppointments();
      }
    });
  }
  
  loadAppointments(){
    this.appointmentService.getAppointmentsByDate().subscribe({
      next: appointments => {
        this.appointments = appointments
        console.log(this.appointments);
      },
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
  }

  ngOnInit(): void {
    //this.loadAppointments();
  }

  loadSchedule(): Date[] {
    const schedule:Date[] = [];
    const numberOfAppointmentsOnDay = (this.getTimeOnMinutes(this.closeTime) - this.getTimeOnMinutes(this.openTime))/this.appointmentTime;
    console.log(`Number of appointments on day: ${numberOfAppointmentsOnDay}`);
    for(let i = 0; i < numberOfAppointmentsOnDay; i++){
      const d = new Date(this.openTime);
      d.setMinutes(d.getMinutes()+this.appointmentTime * i);
      schedule.push(d);
    }
    return schedule;
  }

  getTimeOnMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }


}
