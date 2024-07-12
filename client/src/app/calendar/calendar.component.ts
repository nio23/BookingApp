import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"]
  date = new Date();

  year = this.date.getFullYear();
  monthNumb:number = this.date.getMonth();
  monthStr:string = this.months[this.monthNumb];
  lastDateofMonth = new Date(this.year, this.monthNumb +1, 0).getDate();
  daysOfMonth = Array.from({length:this.lastDateofMonth},(_,i)=> i+1);
  weeks: number = 5;
  weeksArray:any[] = [];


  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(){
    for (let i = 0; i < this.weeks; i++) {
      this.weeksArray.push(Array.from({length: 7}, (_, index) => i*7+(index+1)));
    }
  }

  nextYear(){
    this.year = this.year+1;
  }

  prevYear(){
    this.year = this.year-1;
  }

}


