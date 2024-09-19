import { Component, computed, effect, inject, input, model, OnInit, signal, Signal } from '@angular/core';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../_services/appointment.service';
import { isCurrentDay } from '../_services/utils';
import { toArray } from 'rxjs';



@Component({
  selector: 'app-time',
  standalone: true,
  imports: [TimepickerModule, FormsModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent implements OnInit {
  private appointmentService = inject(AppointmentsService);
  appointmentTime = 30;
  openTime = new Date();
  closeTime = new Date();
  time = signal(new Date());
  appointment = this.appointmentService.appointment; 

  isDisabled: Signal<boolean> = computed(() => {
    const currentDate = new Date();
    if(this.appointment().getDate() < currentDate.getDate())
      return true;
    return false; 
  });



  minTime: Signal<Date> = computed(() =>{
    
    return this.getFirstAppointment(this.appointment());
  });
    
  maxTime:  Signal<Date> = computed(() =>{
    return this.getLastAppointment();
  });


  constructor(){
    this.openTime.setHours(8, 0, 0, 0);
    this.closeTime.setHours(22, 0, 0, 0);
    this.appointmentService.dateChanged.subscribe({
      next: (date) => {
        // const currentTime = new Date();
        // this.setToFirstAppointment(currentTime);
        const d = this.getFirstAppointment(date);
        this.time.set(d);

      }
        
    });
    effect(()=> {
      
      console.log(`Time is: ${this.time()} `);
    })
  }

  ngOnInit(): void {

      const first = this.getFirstAppointment(this.appointment());
      console.log('First available appointment is: ', first);
      this.time.set(first);

  }

  isSameDayAndTime(firstDate: Date , secondDate: Date = new Date()){
    return firstDate.getDate() == secondDate.getDate() && firstDate.getMonth() == secondDate.getMonth() 
    && firstDate.getHours() == secondDate.getHours() && firstDate.getMinutes() == secondDate.getMinutes();
  }

  getLastAppointment():Date{
    const date = new Date(this.time());
    date.setHours(this.closeTime.getHours(), this.closeTime.getMinutes() - this.appointmentTime, 0, 0);
    return date;
  }

  getFirstAppointment(selectedDate:Date):Date{
    const firstAppointment = new Date();
    const today:boolean = isCurrentDay(selectedDate);

    if(!today)
      firstAppointment.setHours(this.openTime.getHours(), this.openTime.getMinutes(), 0, 0);

    let minutesForTheNextAppointment = Math.floor(firstAppointment.getMinutes() / this.appointmentTime) * this.appointmentTime;

    if(today){
      minutesForTheNextAppointment += this.appointmentTime;
    }

    firstAppointment.setMinutes(minutesForTheNextAppointment, 0, 0);

    return firstAppointment;
  }  

  onTimeChange(){
    this.appointmentService.setTime(this.time());
  }

}
