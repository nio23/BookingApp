import { EventEmitter, inject, Injectable, Output } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingConfirmation } from '../_modals/booking-confirmation/booking-confirmation.component';
import { Appointment } from '../_models/appointment';
import { Slot } from '../_models/slot';
import { AccountService } from './account.service';
import { DeleteMyAppointmentComponent } from '../_modals/delete-my-appointment/delete-my-appointment.component';
import { myAppointment } from '../_models/myAppointment';
import { UpdateMyAppointmentComponent } from '../_modals/update-my-appointment/update-my-appointment.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  @Output() appointmentDeleted = new EventEmitter<number>();
  @Output() appointmentBooked = new EventEmitter();
  
  bsModalRef?: BsModalRef;
  modalService = inject(BsModalService);

  
  constructor(private accountService: AccountService){}


  openBookingConfirmationModal(appointment: Slot) {
    
    const initialState: ModalOptions = {
      initialState: {
        title: 'Book the appointment',
        time: appointment.date,
        clientName: this.accountService.currentUser()?.userName
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
        appointment: appointment,
      }
    };
    this.bsModalRef = this.modalService.show(UpdateMyAppointmentComponent, initialState);
  }

  

  hideModal(){
    this.bsModalRef?.hide();
  }

  
}
