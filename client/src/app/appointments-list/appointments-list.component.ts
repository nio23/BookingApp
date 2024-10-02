import { Component, effect, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { AppointmentsService } from '../_services/appointment.service';
import { Appointment } from '../_models/appointment';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { ModalService } from '../_services/modal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent {
  private appointmentService = inject(AppointmentsService);
  modalService = inject(ModalService);
  schedule: Appointment[] = [];
  private closeTime = signal(this.appointmentService.closeTime);
  private openTime = signal(this.appointmentService.openTime);
  private appointmentTime = this.appointmentService.appointmentTime;
  
  constructor() {
    effect(() => {
      this.schedule = this.loadEmptySchedule();
    });
    this.appointmentService.dateChanged.subscribe({
      next: () => {
        this.loadDailyAppointments();
      }
    });
  }
  
  loadDailyAppointments(){
    this.appointmentService.getAppointmentsByDate().pipe(
      map((appointments: Appointment[]) => {
        const emptySchecdule = this.loadEmptySchedule();
        //Fill the empty schedule with the appointments
        appointments.forEach(app => {
          const matchingTime = emptySchecdule.find(slot => this.getDayTimeOnMinutes(slot.date) === this.getDayTimeOnMinutes(new Date(app.date)));
          if (matchingTime){ 
            matchingTime.clientName = app.clientName;
            matchingTime.id = app.id;
            matchingTime.date = new Date(app.date);
          }
        });
        return emptySchecdule;
      }))
    .subscribe({
      next: appointments => {
        this.schedule = appointments;
      },
      error: error => {
        console.log(error);
        this.schedule = this.loadEmptySchedule();
      },
      complete: () => console.log('Request has completed')
    });
  }



  loadEmptySchedule(closeTime: Date = this.closeTime(), openTime: Date = this.openTime()): Appointment[] {
    const schedule:Appointment[] = [];
    const numberOfAppointmentsOnDay = (this.getDayTimeOnMinutes(closeTime) - this.getDayTimeOnMinutes(openTime))/this.appointmentTime;
    console.log(`Number of appointments on day: ${numberOfAppointmentsOnDay}`);
    for(let i = 0; i < numberOfAppointmentsOnDay; i++){
      const d = new Date(openTime);
      d.setMinutes(d.getMinutes()+this.appointmentTime * i);
      schedule.push({date: d, clientName: "" });
    }
    return schedule;
  }

  getDayTimeOnMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }

  openModal(appointment: Appointment){ 
    this.modalService.openModalWithComponent(appointment);
  }


}
