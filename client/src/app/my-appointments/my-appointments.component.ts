import { Component, inject, OnInit } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { AppointmentsService } from '../_services/appointment.service';
import { myAppointment } from '../_models/myAppointment';
import { CommonModule } from '@angular/common';
import { ModalService } from '../_services/modal.service';

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
  modalService = inject(ModalService);

  ngOnInit(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: appointments => {
        this.myAppointments = appointments;
      },
      error: error => {
        console.log(error);
      }
    });

    this.modalService.appointmentDeleted.subscribe({
      next: (id:number) => {
        this.onAppointmentDeleted(id);
      }
    });
  }

  changeAppointment() {
    throw new Error('Method not implemented.');
  }



  openDeleteConfirmationModal(appointment: myAppointment) {
    this.modalService.openDeleteConfirmationModal(appointment);

  }

  onAppointmentDeleted(id: number) {
    this.myAppointments = this.myAppointments.filter(x => x.id !== id);
  }


  

}
