import { Component, inject, OnInit } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { AppointmentsService } from '../../_services/appointment.service';
import { myAppointment } from '../../_models/myAppointment';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../_services/modal.service';

@Component({
  selector: 'app-my-appointments-list',
  standalone: true,
  imports: [CommonModule, AccordionComponent, AccordionPanelComponent],
  templateUrl: './my-appointments-list.component.html',
  styleUrl: './my-appointments-list.component.css'
})
export class MyAppointmentsListComponent implements OnInit {
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

    this.appointmentService.appointmentDeleted.subscribe({
      next: (id:number) => {
        this.onAppointmentDeleted(id);
      }
    });
  }

  changeAppointment(appointment: myAppointment) {
    this.modalService.openUpdateAppointmentModal(appointment);
  }



  openCancelConfirmationModal(appointment: myAppointment) {
    this.modalService.openCancelConfirmationModal(appointment);

  }

  onAppointmentDeleted(id: number) {
    this.myAppointments = this.myAppointments.filter(x => x.id !== id);
  }


  

}
