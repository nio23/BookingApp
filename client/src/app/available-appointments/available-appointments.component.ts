import { Component, inject, OnInit } from '@angular/core';
import { AppointmentsService } from '../_services/appointment.service';
import { Appointment } from '../_models/appointment';
import { CommonModule } from '@angular/common';
import { ModalService } from '../_services/modal.service';
import { Slot } from '../_models/slot';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, BsDatepickerModule, ReactiveFormsModule, FormsModule],
  templateUrl: './available-appointments.component.html',
  styleUrl: './available-appointments.component.css'
})
export class AvailableAppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentsService);
  modalService = inject(ModalService);
  freeSlots: Slot[] = [];
  datePickerConfig: Partial<BsDatepickerConfig>;
  private closeTime = this.appointmentService.closeTime;
  private openTime = this.appointmentService.openTime;
  private appointmentTime = this.appointmentService.appointmentTime;
  selectedDate = new Date();
  
  constructor() {
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false, showTodayButton: true});    
  }

  ngOnInit(): void {
    this.appointmentService.appointmentBooked.subscribe({
      next: (slot: Slot) => {
        this.freeSlots = this.freeSlots.filter(x => x.date !== slot.date);
      }
    });
  }
  
  loadAvailable(date: Date){
    this.appointmentService.getFreeAppointmentsByDate(date).subscribe({
      next: slots => {
        this.freeSlots = slots;
      },
      error: error => {
        console.log(error);
      },
      complete: () => console.log('Available appointments has been loaded!')
    });
  }

  onDateChange(date: Date){
    this.loadAvailable(date);
  }
  
  
  UTCToLocal(utcDate: Date): Date {
    const offset = new Date().getTimezoneOffset();
    return new Date(utcDate.getTime() - offset * 60000);
  }

  loadEmptySchedule(): Appointment[] {
    const schedule:Appointment[] = [];
    const numberOfAppointmentsOnDay = (this.getDayTimeOnMinutes(this.closeTime) - this.getDayTimeOnMinutes(this.openTime))/this.appointmentTime;
    for(let i = 0; i < numberOfAppointmentsOnDay; i++){
      const d = new Date(this.openTime);
      d.setMinutes(d.getMinutes()+this.appointmentTime * i);
      schedule.push({date: d});
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
