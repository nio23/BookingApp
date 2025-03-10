import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable, OnInit, Output, signal } from '@angular/core';
import { Appointment } from '../_models/appointment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { MyAppointment } from '../_models/myAppointment';
import { Slot } from '../_models/slot';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService{
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubsUrl;
  hubConnection?: HubConnection;

  @Output() appointmentDeleted = new EventEmitter<number>();
  @Output() appointmentBooked = new EventEmitter<MyAppointment>();

  
  private _openTime = new Date();
  private _closeTime = new Date();
  private _appointmentTime = 30;

  get openTime() {
    this._openTime.setHours(8, 0, 0, 0);
    return this._openTime;
  }

  get closeTime() {
    this._closeTime.setHours(22, 0, 0, 0);
    return this._closeTime;
  }  

  get appointmentTime() {
    return this._appointmentTime;
  }

  private _minDate = new Date();
  get minDate() {
    return this._minDate;
  }

  private _maxDate = new Date();
  get maxDate() {
    this._maxDate.setDate(this._maxDate.getDate() + 30);
    return this._maxDate;
  }  

  constructor() {
    const user = this.accountService.currentUser();
    if(!user) return;
    this.createHubConnection(user);
  }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl+'appointments', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on('NewAppointment', appointment => {
      console.log('New appointment added');
      this.appointmentBooked.emit(appointment);
    });
  }

  getAppointments(date?: Date): Observable<MyAppointment[]> {
    if(date) {
      return this.http.get<MyAppointment[]>(this.baseUrl + 'appointments/' + this.toISOOnlyDayString(date));
    }
    return this.http.get<MyAppointment[]>(this.baseUrl + 'appointments');
  }

  deleteAppointment(id: number) {
    return this.http.delete(this.baseUrl + 'appointments/'+id).pipe(
      tap({next:() => this.appointmentDeleted.emit(id)})
    );
  }

  getAppointmentsByDate(date: Date = new Date(2024,9,18)) {
    return this.http.get<Appointment[]>(this.baseUrl + 'appointments/' + this.toISOOnlyDayString(date));
  }

  getFreeAppointmentsByDate(date: Date = new Date()) {
    return this.http.get<Slot[]>(this.baseUrl + 'appointments/free/' + this.toISOOnlyDayString(date));
  }

  getMyAppointments(): Observable<MyAppointment[] | MyAppointment[]> {
    //console.log('Getting appointments');
    return this.accountService.hasAdminRole() ? this.getAppointments() : this.http.get<MyAppointment[]>(this.baseUrl + 'appointments/my');    
  }

  async bookAppointmentWs(model: any) {
    return this.hubConnection?.invoke('AddAppointment', model);
  }

  bookAppointment(model: any) {
    return this.http.post<Slot>(this.baseUrl + 'appointments/new', model);
  }

  updateAppointment(model: MyAppointment) {
    return this.http.put(this.baseUrl + 'appointments/', model);
  }

  private toISOOnlyDayString(date: Date): string {
    return date.toISOString().slice(0,10);
  }

  


}
