import { Component, computed, effect, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, debounceTime, skip } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgIf } from '@angular/common';
import { TimeComponent } from "../time/time.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule, NgIf, TimeComponent, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  @ViewChild('dayModal') dayModal: TemplateRef<any> | undefined;

  modalRef?: BsModalRef;
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsInlineValue = new BehaviorSubject<Date>(new Date());
  //bsInlineValue$ = this.bsInlineValue.asObservable();
  //Skips the first two emmssions when creating the component
  selectedDate = signal(new Date());
  

  constructor(private modalService: BsModalService){
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false})
    effect(()=> console.log(this.selectedDate()));
  }

  onDateChange(selected: Date){
    //this.bsInlineValue.next(selected);
    let d = new Date();
    selected.setHours(d.getHours(), d.getMinutes(), d.getSeconds());
    this.selectedDate.set(selected);
  }

  openModal(){
    if(this.dayModal != undefined)
      this.modalRef = this.modalService.show(this.dayModal);
  }

  ngOnInit(): void {
    // this.bsInlineValue$.pipe(skip(2)).subscribe({
    //   next: (date)=> {
    //     this.selectedDate.set(date);
    //     console.log(this.selectedDate());
    //   }
    // });

  }



}


