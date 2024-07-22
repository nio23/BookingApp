import { Injectable } from '@angular/core';
import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  modalRef?: BsModalRef;

  constructor(private modalService: BsModalService) {

  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  hideModal(){
    this.modalRef?.hide();
  }
}
