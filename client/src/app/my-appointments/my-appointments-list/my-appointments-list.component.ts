import { Component, inject, input, model, OnInit } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { AppointmentsService } from '../../_services/appointment.service';
import { MyAppointment } from '../../_models/myAppointment';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../_services/modal.service';
import { AccountService } from '../../_services/account.service';
import { Appointment } from '../../_models/appointment';
import { AppointmentTypePipe } from '../../_pipes/appointment-type.pipe';

@Component({
  selector: 'app-my-appointments-list',
  standalone: true,
  imports: [CommonModule, AccordionComponent, AccordionPanelComponent, AppointmentTypePipe],
  templateUrl: './my-appointments-list.component.html',
  styleUrl: './my-appointments-list.component.css'
})
export class MyAppointmentsListComponent implements OnInit {
  appointmentService = inject(AppointmentsService);
  accountService = inject(AccountService)
  appointments = model<MyAppointment[] | Appointment[]>(this.appointmentService.appointments());
  modalService = inject(ModalService);

  ngOnInit(): void {
    this.appointmentService.appointmentDeleted.subscribe({
      next: (id:number) => {
        this.onAppointmentDeleted(id);
      }
    });

    this.appointmentService.appointmentBooked.subscribe({
      next: () => {
        this.appointmentService.getMyAppointments();
      }
    });
  }

  changeAppointment(appointment: any) {
    this.modalService.openUpdateAppointmentModal(appointment);
  }

  openCancelConfirmationModal(appointment: any) {
    this.modalService.openCancelConfirmationModal(appointment);

  }

  onAppointmentDeleted(id: number) {
    this.appointments.update( apo => apo.filter(x => x.id !== id));
  }
}
