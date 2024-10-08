import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentsService } from '../_services/appointment.service';
import { toISOStringFormat } from '../_services/utils';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgIf],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentsService);
  title?: string;
  closeBtnName?: string;
  time?: Date = new Date();
  clientName: string = '';
  id?: number | undefined;
  bsModalRef = inject(BsModalRef);
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
    //const ISOFormat = toISOStringFormat(this.bookForm.value.date);
    //this.bookForm.patchValue({date: ISOFormat});
    console.log(this.bookForm.value.date);
    if (this.id === undefined){
      this.appointmentService.bookAppointment(this.bookForm.value).then(() => {
        this.bsModalRef.hide();
      }).catch(error => {
        this.validationError = error.error;
      });
    }else{
      this.appointmentService.updateAppointment(this.id, this.bookForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
        },
        error: error => {
          this.validationError = error.error;
        }
      });
    }
    
  }
  
}
