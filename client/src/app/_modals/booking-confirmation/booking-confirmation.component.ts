import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DatePipe, TitleCasePipe} from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentsService } from '../../_services/appointment.service';
import { toISOStringFormat } from '../../_services/utils';
import { ModalService } from '../../_services/modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.css'
})
export class BookingConfirmation implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentsService);
  private toastr = inject(ToastrService);
  modalService = inject(ModalService);
  title?: string;
  closeBtnName?: string;
  time?: Date = new Date();
  clientName: string = '';
  id?: number | undefined;
  bookForm: FormGroup = new FormGroup({});
  validationError: string | undefined;
 
  ngOnInit() {
    this.initializeForm();
    console.log("Modal initialized"+this.id+" "+this.clientName+" "+this.time);

  }

  initializeForm(){
    this.bookForm = this.fb.group({
      date: [this.time, Validators.required],
      clientName: [this.clientName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]    
    });
  }

  book(){
    console.log(this.bookForm.value.date);
    this.appointmentService.bookAppointment(this.bookForm.value).then(() => {
      this.modalService.hideModal();
      this.appointmentService.appointmentBooked.emit();
      this.toastr.success('Appointment booked successfully');
    }).catch(error => {
      this.validationError = error;
      console.log(error);
    });
  }
  
}
