import { Component, effect, inject } from '@angular/core';
import { AppointmentsService } from '../_services/appointment.service';
import { Appointment } from '../_models/appointment';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { ModalService } from '../_services/modal.service';
import { Slot } from '../_models/slot';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './available-appointments.component.html',
  styleUrl: './available-appointments.component.css'
})
export class AvailableAppointmentsComponent {
  private appointmentService = inject(AppointmentsService);
  modalService = inject(ModalService);
  schedule: Slot[] = [];
  private closeTime = this.appointmentService.closeTime;
  private openTime = this.appointmentService.openTime;
  private appointmentTime = this.appointmentService.appointmentTime;
  
  constructor() {
    effect(() => {
      //this.schedule = this.loadEmptySchedule();
    });
    this.appointmentService.dateChanged.subscribe({
      next: () => {
        this.loadAvailable();
      }
    });

    // this.appointmentService.dataUpdated.subscribe({
    //   next: (appointment:Appointment) => {
    //     const currentSelectedDate = this.appointmentService.appointment();
    //     const localDate = new Date(appointment.date);
    //     if(!this.isTheSameDate(currentSelectedDate, localDate)){
    //       return;
    //     }
    //     console.log("Appointment is the same date ");
    //     const matchingTime = this.schedule.find(slot => this.getDayTimeOnMinutes(slot.date) === this.getDayTimeOnMinutes(localDate));
    //     if (matchingTime){ 
    //       matchingTime.clientName = appointment.clientName;
    //       matchingTime.id = appointment.id;
    //     }
    //   }
    // });
    
  }
  
  loadAvailable(){
    this.appointmentService.getFreeAppointmentsByDate().subscribe({
      next: slots => {
        this.schedule = slots;
      },
      error: error => {
        console.log(error);
      },
      complete: () => console.log('Available appointments has been loaded!')
    });
  }
  
  // loadDailyAppointments(){
  //   this.appointmentService.getFreeAppointmentsByDate().pipe(
  //     map((appointments: Appointment[]) => {
  //       const emptySchedule = this.loadEmptySchedule();
  //       //Fill the empty schedule with the appointments
  //       appointments.forEach(app => {
  //         const utcDate = new Date(app.date);
  //         const localDate = this.UTCToLocal(utcDate);
  //         const matchingTime = emptySchedule.find(slot => this.getDayTimeOnMinutes(slot.date) === this.getDayTimeOnMinutes(localDate));
  //         if (matchingTime){ 
  //           matchingTime.clientName = app.clientName;
  //           matchingTime.id = app.id;
  //         }
  //       });
  //       return emptySchedule;
  //     }))
  //   .subscribe({
  //     next: appointments => {
  //       this.schedule = appointments;
  //     },
  //     error: error => {
  //       console.log(error);
  //       this.schedule = this.loadEmptySchedule();
  //     },
  //     complete: () => console.log('Request has completed')
  //   });
  // }
  
  UTCToLocal(utcDate: Date): Date {
    const offset = new Date().getTimezoneOffset();
    return new Date(utcDate.getTime() - offset * 60000);
  }

  loadEmptySchedule(): Appointment[] {
    const schedule:Appointment[] = [];
    const numberOfAppointmentsOnDay = (this.getDayTimeOnMinutes(this.closeTime()) - this.getDayTimeOnMinutes(this.openTime()))/this.appointmentTime;
    for(let i = 0; i < numberOfAppointmentsOnDay; i++){
      const d = new Date(this.openTime());
      d.setMinutes(d.getMinutes()+this.appointmentTime * i);
      schedule.push({date: d, clientName: "" });
    }
    return schedule;
  }

  getDayTimeOnMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }

  openModal(appointment: Slot){ 
    console.log("Opening modal "+appointment.date);
    this.modalService.openBookingConfirmationModal(appointment);
  }


  isTheSameDate(first: Date, second: Date): boolean {
    return first.getUTCDate() === second.getUTCDate() && first.getUTCMonth() === second.getUTCMonth() && first.getUTCFullYear() === second.getUTCFullYear();
  }

}
