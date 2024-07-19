import { Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsInlineValue = new Date();

  constructor(){
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false})
  }


  onDateSelected(selected: Date){
    this.bsInlineValue = selected;
    console.log(`Selected date is ${this.bsInlineValue}`);
  }

  ngOnInit(): void {

  }

}


