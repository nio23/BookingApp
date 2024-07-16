import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { of } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, BsDropdownModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
  
  date = new Date();
  year = this.date.getFullYear();

  //Month from 0..11
  monthNumb:number = this.date.getMonth();
  monthStr:string = this.months[this.monthNumb];
  firstDayOfMonth = new Date(this.year, this.monthNumb, 1).getDay();
  lastDateofMonth = new Date(this.year, this.monthNumb + 1, 0).getDate();
  //daysOfMonth = Array.from({length:this.lastDateofMonth},(_,i)=> i+1);
  weeks: number = 5;
  weeksArray:any = [];

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(){
    this.weeksArray = [];
    let curDay = 1;
    for (let i = 0; i < this.weeks; i++) {
      this.weeksArray.push(Array.from({length: 7}, (_, index) => {
        var date = i*7+(index);
        return ( date >= this.firstDayOfMonth && date<=this.lastDateofMonth) ? curDay++ : "";
      }))
    }
    console.log(this.firstDayOfMonth);
    console.log(this.weeksArray);
  }

  nextYear(){
    this.year = this.year+1;
  }

  prevYear(){
    this.year = this.year-1;
  }

  changeMonth(month:number){
    this.monthNumb = month;
    this.monthStr = this.months[this.monthNumb]
    this.calcFirstDayOfMonth();
    this.generateCalendar();
  }

  calcFirstDayOfMonth(){
    this.firstDayOfMonth = new Date(this.year, this.monthNumb, 1).getDay();
  }

}


