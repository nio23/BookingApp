import { Component, inject, OnInit } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { AppointmentsService } from '../_services/appointment.service';
import { myAppointment } from '../_models/myAppointment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, AccordionComponent, AccordionPanelComponent],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit {
  appointmentService = inject(AppointmentsService);
  myAppointments: myAppointment[] = [];

  ngOnInit(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: appointments => {
        this.myAppointments = appointments;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  changeAppointment() {
    throw new Error('Method not implemented.');
  }

  deleteAppointment(id: number) {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        console.log('Appointment deleted');
        this.myAppointments = this.myAppointments.filter(x => x.id !== id);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  

}
