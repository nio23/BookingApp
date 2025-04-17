import { Component, DestroyRef, inject, Input, input, model, OnInit } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { AppointmentsService } from '../../_services/appointment.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../_services/modal.service';
import { AccountService } from '../../_services/account.service';
import { Appointment } from '../../_models/appointment';
import { AppointmentTypePipe } from '../../_pipes/appointment-type.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-my-appointments-list',
  standalone: true,
  imports: [CommonModule, AccordionComponent, AccordionPanelComponent, AppointmentTypePipe],
  templateUrl: './my-appointments-list.component.html',
  styleUrl: './my-appointments-list.component.css'
})
export class MyAppointmentsListComponent implements OnInit {
  private appointmentService = inject(AppointmentsService);
  appointments = model<Appointment[]>();
  private modalService = inject(ModalService);
  #destroyref = inject(DestroyRef);

  ngOnInit(): void {
    this.appointmentService.appointmentDeleted.subscribe({
      next: (id:number) => {
        this.onAppointmentDeleted(id);
      }
    });

    if(this.appointments() === undefined){
      this.appointmentService.getMyAppointments().subscribe({
        next: appointments => {
          this.appointments.set(appointments);
        }
      });
    }

    this.appointmentService.appointmentBooked.pipe(takeUntilDestroyed(this.#destroyref)).subscribe({
      next: (appointment: Appointment) => {
        this.appointments.update(appointments => appointments?.concat(appointment));
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
    this.appointments.update(appointments => appointments?.filter(x => x.id !== id));
  }
}
