import { Component, computed, effect, input, model, OnInit, signal, Signal } from '@angular/core';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../_services/appointment.service';



@Component({
  selector: 'app-time',
  standalone: true,
  imports: [TimepickerModule, FormsModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent implements OnInit {
  appointmentTime = 30;
  time = signal(new Date());
  appointment = signal(new Date()); 

  isDisabled: Signal<boolean> = computed(() => {
    const currentDate = new Date();
    if(this.appointment().getDate() < currentDate.getDate())
      return true;
    return false; 
  });



  minTime: Signal<Date> = computed(() =>{
    

    if(this.isCurrentDay(this.appointment())){
      const currentTime = new Date();
      var next = this.firstAvailableAppointment(currentTime);
      console.log('First available appointment is: ', next);
      return next;
    }

    let d = new Date(this.time());
    d.setHours(8,0,0,0);
    return d;
  });
    
  maxTime:  Signal<Date> = computed(() =>{
    const d = new Date(this.time());
    d.setHours(22, 1, 0, 0);
    return d;
  });


  constructor(private appointmentService: AppointmentsService){
    this.appointment = appointmentService.appointment;
    effect(()=> {
      
      console.log(`Time is: ${this.time()} `);
    })
  }

  ngOnInit(): void {
    var next = this.firstAvailableAppointment(this.appointment());
    this.time.set(next);

  }

  isSameDayAndTime(firstDate: Date , secondDate: Date = new Date()){
    return firstDate.getDate() == secondDate.getDate() && firstDate.getMonth() == secondDate.getMonth() 
    && firstDate.getHours() == secondDate.getHours() && firstDate.getMinutes() == secondDate.getMinutes();
  }

  firstAvailableAppointment(date: Date):Date{
    
    if(date.getMinutes() > this.appointmentTime){
      date.setHours(date.getHours()+1, 0, 0, 0);
    }
    else{
      date.setMinutes(this.appointmentTime, 0, 0);
    }
    return date;
  }

  isCurrentDay(date: Date){
    let currentDate = new Date();
    return date.getDate() == currentDate.getDate() && date.getMonth() == currentDate.getMonth();
  }

  timeOnMinutes(date: Date):number{
    return date.getHours() * 60 + date.getMinutes();
  }

  onTimeChange(){
    this.appointmentService.setTime(this.time());
  }
}
