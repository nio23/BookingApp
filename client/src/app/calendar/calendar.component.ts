import { Component, computed, effect, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, debounceTime, skip } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgIf } from '@angular/common';
import { TimeComponent } from "../time/time.component";
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule, NgIf, TimeComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  @ViewChild('dayModal') dayModal: TemplateRef<any> | undefined;

  registerForm: FormGroup = new FormGroup({});
  modalRef?: BsModalRef;
  datePickerConfig: Partial<BsDatepickerConfig>;
  selectedDate = signal(new Date());
  

  constructor(private modalService: BsModalService){
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false, showTodayButton: true});
    //this.selectedDate.update(value => new Date(value.setMinutes(0,0)));
    effect(()=> console.log(this.selectedDate()));
  }


  onDateChange(date: Date){
    date.setMinutes(0,0);
    this.selectedDate.set(date);
  }


  ngOnInit(): void {
  }



}


