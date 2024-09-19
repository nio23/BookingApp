import { Component, inject, OnInit } from '@angular/core';
import { AppointmentsService } from '../_services/appointment.service';
import { Appointment } from '../_models/appointment';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {


  private appointmentService = inject(AppointmentsService);
  appointments: Appointment[] = [];
  
  constructor() {
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

}
