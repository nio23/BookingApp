import { Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
  
  date = signal(new Date());
  //Month from 0..11
  monthNumb: Signal<number> = computed(()=> this.date().getMonth());
  monthStr: Signal<string> = computed(() => this.months[this.monthNumb()]);

  weeks: number = 5;
  weeksArray:any = [];

  // constructor(){
  //   // effect(()=>{
  //   //   this.generateCalendar();
  //   // })
  // }

  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();
 
  constructor() {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
  }

  ngOnInit(): void {

  }

  // generateCalendar(){
  //   let firstDayOfWeek: number =  new Date(this.date().getFullYear(), this.monthNumb(), 1).getDay();
  //   let lastDateofMonth: number =  new Date(this.date().getFullYear(), this.monthNumb() + 1, 0).getDate();
  //   let lastDateOfPreviousMonth: number = new Date(this.date().getFullYear(), this.monthNumb(), 0).getDate();
  //   this.weeksArray = [];
  //   let day = 1;
  //   let firstDayOfPreviousMonth = lastDateOfPreviousMonth - firstDayOfWeek + 1
  //   let firstDayOfNextMonth = 1;
  //   for (let i = 0; i < this.weeks; i++) {
  //     this.weeksArray.push(Array.from({length: 7}, (_, index) => {
  //       let date = i*7+(index);
  //       if(date >= firstDayOfWeek && day <= lastDateofMonth)
  //         return day++;
  //       if(date < firstDayOfWeek)
  //         return firstDayOfPreviousMonth++;
  //       return firstDayOfNextMonth++;
  //     }))
  //   }
  // }

  nextYear(){
    this.date.update(value => value = new Date(value.getFullYear()+1, value.getMonth()));
  }

  prevYear(){
    this.date.update(value => value = new Date(value.getFullYear()-1, value.getMonth()));
  }

  changeMonth(selectedMonth:number){
    this.date.update(value => value = new Date(value.getFullYear(), selectedMonth));
  }

}


