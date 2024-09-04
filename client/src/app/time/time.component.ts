import { Component, computed, effect, input, model, Signal } from '@angular/core';
import { TimepickerModule, TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-time',
  standalone: true,
  imports: [TimepickerModule, FormsModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent {
  appointmentTime = 30;
  selectedDate = input.required<Date>();

  isDisabled: Signal<boolean> = computed(() => {
    let currentDate = new Date();
    if(this.displayTime() < currentDate)
      return true;
    return false; 
  });

  displayTime: Signal<Date> = computed(() =>{
    let d = new Date(this.selectedDate());    
    this.selectedDate().getMinutes() > this.appointmentTime ? d.setHours(d.getHours()+1, 0) : d.setMinutes(30, 0);
    return d;
  });

  minTime: Signal<Date> = computed(() =>{
    let currentDate = new Date();
    
    if(this.selectedDate().getDate() == currentDate.getDate()){
      currentDate.setHours(currentDate.getHours(), currentDate.getMinutes(), 0);
      return currentDate;
    }

    let d = new Date(this.selectedDate());
    d.setHours(8,0,0);
    return d;
  });
    
  maxTime:  Signal<Date> = computed(() =>{
    let d = new Date(this.selectedDate());
    d.setHours(22, 1, 0);
    return d;
  });


  constructor(){
    effect(()=> {
      console.log(`Date is: ${this.selectedDate()} `)
      console.log(this.isDisabled())
    })
  }
}
