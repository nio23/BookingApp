import { EventEmitter, inject, Injectable, Output } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingConfirmation } from '../_modals/booking-confirmation/booking-confirmation.component';
import { Appointment } from '../_models/appointment';
import { Slot } from '../_models/slot';
import { AccountService } from './account.service';
import { DeleteMyAppointmentComponent } from '../_modals/delete-my-appointment/delete-my-appointment.component';
import { myAppointment } from '../_models/myAppointment';
import { UpdateMyAppointmentComponent } from '../_modals/update-my-appointment/update-my-appointment.component';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ModalService {  
  bsModalRef?: BsModalRef;
  modalService = inject(BsModalService);
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);


  openBookingConfirmationModal(appointment: Slot) {
    if(!this.accountService.currentUser()){
      this.toastr.error('You need to be logged in to book an appointment');
      return;
    }
    const initialState: ModalOptions = {
      initialState: {
        title: 'Book the appointment',
        time: appointment.date,
        clientName: this.accountService.currentUser()?.username
      }
    };
    this.bsModalRef = this.modalService.show(BookingConfirmation, initialState);
  }

  openDeleteConfirmationModal(appointment: myAppointment){
    const initialState: ModalOptions = {
      initialState: {
        appointment: appointment,
      }
    };
    this.bsModalRef = this.modalService.show(DeleteMyAppointmentComponent, initialState);
  }

  openUpdateAppointmentModal(appointment: myAppointment){
    const initialState: ModalOptions = {
      initialState: {
        myAppointment: appointment,
      }
    };
    this.bsModalRef = this.modalService.show(UpdateMyAppointmentComponent, initialState);
  }

  

  hideModal(){
    this.bsModalRef?.hide();
  }

  
}
