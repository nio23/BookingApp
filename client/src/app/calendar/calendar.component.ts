import { Component, computed, effect, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, debounceTime, skip } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgIf } from '@angular/common';
import { TimeComponent } from "../time/time.component";
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppointmentsService } from '../_services/appointment.service';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule, NgIf, TimeComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  datePickerConfig: Partial<BsDatepickerConfig>;
  initDate = new Date();
  selectedDate = signal(new Date());
  

  constructor(private appointmentService: AppointmentsService) {
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false, showTodayButton: true});
    effect(() => {
      console.log(`Calendar date is: ${this.selectedDate()}`);
    })
  }


  onDateChange(date: Date){
    // const currentDate = new Date();
    // if(date.getDate() < currentDate.getDate()){
    //   this.appointmentService.setFullDate(date);
    // }else
    console.log('Date changed to: ', date);
    this.selectedDate.set(date);
    const currentDate = new Date();
    // if(date.getDate() == currentDate.getDate()){
      
    //   this.appointmentService.setFullDate(currentDate);
    // }
    this.appointmentService.setDate(date);
    
    //this.selectedDate.update(value => new Date(date.setHours(value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds())));
    // console.log('Date changed to: ', this.selectedDate());
  }


  ngOnInit(): void {
    this.selectedDate.set(this.appointmentService.appointment());
  }



}


