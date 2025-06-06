import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentsService } from '../../_services/appointment.service';
import { ModalService } from '../../_services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from '../../_models/appointment';

@Component({
  selector: 'app-cancel-my-appointment',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './cancel-my-appointment.component.html',
  styleUrl: './cancel-my-appointment.component.css'
})
export class CancelMyAppointmentComponent implements OnInit {
  private toastr = inject(ToastrService);
  modalService = inject(ModalService);
  appointmentService = inject(AppointmentsService);
  appointment?: Appointment;
  error: string | undefined;

  ngOnInit(): void {
    console.log("Modal initialized"+this.appointment?.id+" "+this.appointment?.date);
  }

  cancelAppointment() {
    if (this.appointment?.id === undefined){
      console.log("Appointment id is undefined");
      return;
    } 

    this.appointmentService.deleteAppointment(this.appointment.id).subscribe({
      next: () => {
        console.log('Appointment deleted');
        //this.appointmentService.appointmentDeleted.emit(this.appointment!!.id);
        this.hideModal();
        this.toastr.success('Your appointment deleted');
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
