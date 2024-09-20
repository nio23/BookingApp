import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, model, OnInit, signal } from '@angular/core';
import { Appointment } from '../_models/appointment';
import { Observable, Subject } from 'rxjs';
import { toOnlyDateString } from './utils';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService{
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api/';
  private _appointment = signal(new Date());
  private _openTime = new Date();
  private _closeTime = new Date();
  private _appointmentTime = 30;

  //appointmentTime = 30;
  dateChanged = new Subject<Date>();

  constructor() {

    effect(() => {
      console.log(`Service date is: ${this._appointment()}`);
    });

    this._openTime.setHours(8, 0, 0, 0);
    this._closeTime.setHours(22, 0, 0, 0);

    this.dateChanged.subscribe({
      next: date => {
        this.setDate(date)
      },
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
    // this.getAppointments().subscribe({
    //   next: response => console.log(response),
    //   error: error => console.log(error),
    //   complete: () => console.log('Request has completed')
    // });

  }

  public get openTime() {
    return this._openTime;
  }

  public get closeTime() {
    return this._closeTime;
  }

  public get appointment() {
    return this._appointment.asReadonly();
  }

  public get appointmentTime() {
    return this._appointmentTime;
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
    return this.http.get<Appointment[]>(this.baseUrl + 'appointments/' + toOnlyDateString(this._appointment()));
  }
  

}
