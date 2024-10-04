import { HttpClient } from '@angular/common/http';
import { computed, effect, EventEmitter, inject, Injectable, Input, model, OnInit, Output, signal } from '@angular/core';
import { Appointment } from '../_models/appointment';
import { Observable, Subject } from 'rxjs';
import { toOnlyDateString } from './utils';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService{
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api/';

  @Input() 
  private _appointment = signal(new Date());
  get appointment() {
    return this._appointment.asReadonly();
  }
  
  @Input() 
  private _openTime = computed(()=> {
    return new Date(this._appointment().setHours(8, 0, 0, 0));
  });
  get openTime() {
    return this._openTime;
  }
  
  @Input() 
  private _closeTime = computed(()=> {
    return new Date(this._appointment().setHours(22, 0, 0, 0));
  });
  get closeTime() {
    return this._closeTime;
  }  

  @Input() 
  private _appointmentTime = 30;
  get appointmentTime() {
    return this._appointmentTime;
  }
  

  @Output() dateChanged = new EventEmitter<Date>();
  

  constructor() {

    effect(() => {
      console.log(`Service date is: ${this._appointment()}`);
    });

    this.dateChanged.subscribe({
      next: (date: Date) => {
        this.setDate(date);
      },
      error: (error: any) => console.log(error),
      complete: () => console.log('Request has completed')
    });

  }

  getAppointments() {
    return this.http.get<Appointment[]>(this.baseUrl + 'appointments');
  }

  setDate(date: Date){
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    this._appointment.update(value => new Date(value.setFullYear(year,month,day)));
  }

  setTime(date: Date){
    const hours = date.getHours();
    const minutes = date.getMinutes();
    this._appointment.update(value => new Date(value.setHours(hours, minutes, 0, 0)));
  }

  setFullDate(date: Date){
    this.setDate(date);
    this.setTime(date);
  }

  getAppointmentsByDate(date: Date = new Date(2024,9,18)) {
    //return this.http.get<Appointment[]>(this.baseUrl + 'appointments/' + toOnlyDateString(this._appointment()));
    return this.http.get<Appointment[]>(this.baseUrl + 'appointments/' + this.toISOOnlyDayString(this._appointment()));
  }

  bookAppointment(model: any) {
    return this.http.post(this.baseUrl + 'appointments/add', model);
  }

  updateAppointment(id: number, model: any) {
    return this.http.put(this.baseUrl + 'appointments/' + id, model);
  }

  private toISOOnlyDayString(date: Date): string {
    return date.toISOString().slice(0,10);
  }


}
