import { Component, computed, effect, input, model, OnInit, signal, Signal } from '@angular/core';
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
  selectedDate = model.required<Date>();


  isDisabled: Signal<boolean> = computed(() => {
    let currentDate = new Date();
    if(this.selectedDate().getDate() < currentDate.getDate())
      return true;
    return false; 
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
      console.log(`Date is: ${this.selectedDate()} `);
      console.log(this.isDisabled());
      
      //this.selectedDate().getMinutes() > this.appointmentTime ? this.selectedDate().setHours(this.selectedDate().getHours()+1, 0) : this.selectedDate().setMinutes(30, 0);
      
    })
  }


}
