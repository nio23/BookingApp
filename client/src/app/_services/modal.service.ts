import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../modal/modal.component';
import { Appointment } from '../_models/appointment';
import { Slot } from '../_models/slot';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef?: BsModalRef;
  modalService = inject(BsModalService);
  
  constructor(private accountService: AccountService){}


  openModalWithComponent(appointment: Slot) {
    
    const initialState: ModalOptions = {
      initialState: {
        title: 'Book the appointment',
        time: appointment.date,
        clientName: this.accountService.currentUser()?.userName
      }
    };
    this.bsModalRef = this.modalService.show(ModalComponent, initialState);
  }

  

  hideModal(){
    this.bsModalRef?.hide();
  }

  
}
