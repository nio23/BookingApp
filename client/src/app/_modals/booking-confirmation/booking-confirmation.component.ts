import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, NgIf, TitleCasePipe} from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentsService } from '../../_services/appointment.service';
import { ModalService } from '../../_services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, TitleCasePipe, NgIf],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.css'
})
export class BookingConfirmation implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentsService);
  accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  modalService = inject(ModalService);
  title?: string;
  closeBtnName?: string;
  time?: Date = new Date();
  clientName?: string;
  id?: number | undefined;
  bookForm: FormGroup = new FormGroup({});
  validationError: string | undefined;
 
  ngOnInit() {
    this.initializeForm();
    console.log("Modal initialized"+this.id+" "+this.clientName+" "+this.time+ " "+this.clientName);

  }

  initializeForm(){
    this.bookForm = this.fb.group({
      date: [this.time, Validators.required],
      clientName: [this.accountService.hasAdminRole() ? "" : this.clientName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]    
    });
  } 

  book(){
    console.log(this.bookForm.value);
    this.appointmentService.bookAppointmentWs(this.bookForm.value).then(
      () => {
        this.modalService.hideModal();
        //this.appointmentService.appointmentBooked.emit(appo);
        this.toastr.success('Appointment booked successfully');
      }).catch((error: any) => {
        console.log(error);
        this.validationError = error.error;
        //this.toastr.error('Failed to book appointment');
      })
    // this.appointmentService.bookAppointment(this.bookForm.value).subscribe({
    //   next: (appo: any) => {
    //     console.log(appo);
    //     this.modalService.hideModal();
    //     this.appointmentService.appointmentBooked.emit(appo);
    //     this.toastr.success('Appointment booked successfully');
    //   },
    //   error: error => {
    //     this.validationError = error.error;
    //     console.log(error);
    //   }
      
    // });
  }

}
