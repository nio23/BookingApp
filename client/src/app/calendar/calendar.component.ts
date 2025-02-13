import { Component, EventEmitter, Output } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  selectedDate = new Date();
  datePickerConfig: Partial<BsDatepickerConfig>;
  @Output() dateChanged = new EventEmitter<Date>();
  
  constructor() {
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false, showTodayButton: true});    
  }

  onDateChange(date: Date){
    this.dateChanged.emit(date);
  }
}
