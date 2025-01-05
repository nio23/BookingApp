import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppointmentsService } from '../_services/appointment.service';
import { isCurrentDay } from '../_services/utils';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule, ReactiveFormsModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  private appointmentService = inject(AppointmentsService);
  registerForm: FormGroup = new FormGroup({});
  datePickerConfig: Partial<BsDatepickerConfig>;
  initDate = new Date();
  selectedDate = signal(new Date());
  

  constructor() {
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false, showTodayButton: true});
    effect(() => {
      console.log(`Calendar date is: ${this.selectedDate()}`);
    })
  }


  onDateChange(date: Date){


    this.selectedDate.set(date);
    //this.appointmentService.setDate(date);
    this.appointmentService.dateChanged.next(date);
    if(isCurrentDay(date) ){
      
      console.log('Current day');
      //this.appointmentService.setTime(date);
    }
    

  }


  ngOnInit(): void {
    this.selectedDate.set(this.appointmentService.appointment());
  }





}


