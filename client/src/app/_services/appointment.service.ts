import { effect, Injectable, model, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  appointment = signal(new Date());


  constructor() {
    effect(() => {
      console.log(`Service date is: ${this.appointment()}`);
    });

  }

  setDate(date: Date){
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    this.appointment.update(value => new Date(value.setFullYear(year,month,day)));
  }

  setTime(date: Date){
    const hours = date.getHours();
    const minutes = date.getMinutes();
    this.appointment.update(value => new Date(value.setHours(hours, minutes, 0, 0)));
  }

  setFullDate(date: Date){
    this.setDate(date);
    this.setTime(date);
  }

  

}
