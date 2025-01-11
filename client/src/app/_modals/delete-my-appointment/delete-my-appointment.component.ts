import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, TitleCasePipe} from '@angular/common';
import { myAppointment } from '../../_models/myAppointment';
import { AppointmentsService } from '../../_services/appointment.service';
import { ModalService } from '../../_services/modal.service';

@Component({
  selector: 'app-delete-my-appointment',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './delete-my-appointment.component.html',
  styleUrl: './delete-my-appointment.component.css'
})
export class DeleteMyAppointmentComponent implements OnInit {
  
  modalService = inject(ModalService);
  appointmentService = inject(AppointmentsService);
  appointment?: myAppointment;
  error: string | undefined;

  ngOnInit(): void {
    console.log("Modal initialized"+this.appointment?.id+" "+this.appointment?.date);
  }

  deleteAppointment() {
    this.appointmentService.deleteAppointment(this.appointment!!.id).subscribe({
      next: () => {
        console.log('Appointment deleted');
        this.modalService.appointmentDeleted.emit(this.appointment!!.id);
        this.hideModal();
        //this.myAppointments = this.myAppointments.filter(x => x.id !== id);
      },
      error: error => {
        this.error = error.error;
        console.log(error);
      }
    });
  }

  hideModal(){
    this.modalService.hideModal();
  }
}
