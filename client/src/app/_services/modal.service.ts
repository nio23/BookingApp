import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../modal/modal.component';
import { Appointment } from '../_models/appointment';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef?: BsModalRef;
  modalService = inject(BsModalService);
  

  openModalWithComponent(appointment: Appointment) {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Book the appointment',
        time: appointment.date,
        clientName: appointment.clientName,
        id: appointment.id
      }
    };
    this.bsModalRef = this.modalService.show(ModalComponent, initialState);
    //this.bsModalRef.content.id = appointment.id;
  }

  

  hideModal(){
    this.bsModalRef?.hide();
  }

  
}
