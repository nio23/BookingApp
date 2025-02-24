import { Component, inject, Input, input, model, OnInit } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { AppointmentsService } from '../../_services/appointment.service';
import { MyAppointment } from '../../_models/myAppointment';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../_services/modal.service';
import { AccountService } from '../../_services/account.service';
import { Appointment } from '../../_models/appointment';
import { AppointmentTypePipe } from '../../_pipes/appointment-type.pipe';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-my-appointments-list',
  standalone: true,
  imports: [CommonModule, AccordionComponent, AccordionPanelComponent, AppointmentTypePipe],
  templateUrl: './my-appointments-list.component.html',
  styleUrl: './my-appointments-list.component.css'
})
export class MyAppointmentsListComponent implements OnInit {
  private appointmentService = inject(AppointmentsService);
  accountService = inject(AccountService)
  @Input() $appointments: Observable<Appointment[] | MyAppointment[]> = this.appointmentService.getMyAppointments();
  appointments: (Appointment[] | MyAppointment[]) =[];
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.$appointments.subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      }
    });
    console.log("Appointment list init");
    this.appointmentService.appointmentDeleted.subscribe({
      next: (id:number) => {
        this.onAppointmentDeleted(id);
      }
    });

    this.appointmentService.appointmentBooked.subscribe({
      next: (appointment: MyAppointment) => {
        //this.appointmentService.getMyAppointments();
        this.$appointments.pipe(
          map(appointments => appointments.push(appointment))
        );
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
    this.$appointments = this.$appointments.pipe(
      map(appointments => appointments.filter(x => x.id !== id))
    );
  }
}
