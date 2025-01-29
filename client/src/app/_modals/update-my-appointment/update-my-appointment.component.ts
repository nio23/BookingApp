import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ModalService } from '../../_services/modal.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsService } from '../../_services/appointment.service';
import { filter, first, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Slot } from '../../_models/slot';
import { myAppointment } from '../../_models/myAppointment';

@Component({
  selector: 'app-update-my-appointment',
  standalone: true,
  imports: [CommonModule, BsDatepickerModule, FormsModule],
  templateUrl: './update-my-appointment.component.html',
  styleUrl: './update-my-appointment.component.css'
})
export class UpdateMyAppointmentComponent implements OnInit {
  modalService = inject(ModalService);
  appointmentService = inject(AppointmentsService);

  myAppointment?: myAppointment;
  freeSlots: Slot[] = [];
  selectedSlot: Slot | null = null;
  httpErrors: string[] | undefined;
  selectedDate: Date = new Date();

  ngOnInit(): void {
    this.getAvailableSlots(this.selectedDate);
  }

  onSlotSelected(slot: Slot){
    this.selectedSlot = slot;
    console.log("Selected "+this.selectedSlot.date);
  }

  getAvailableSlots(date: Date) {
    this.appointmentService.getFreeAppointmentsByDate(date).pipe(
      map((slots) => slots.filter((slot: Slot) => new Date(slot.date).getTime() > new Date().getTime()))
    ).subscribe((slots) => {
      this.freeSlots = slots;
    });
  }

  updateMyAppointment() {
    if(this.myAppointment === undefined || this.selectedSlot === null)
      return;

    this.myAppointment.date = this.selectedSlot.date;
    this.appointmentService.updateAppointment(this.myAppointment).subscribe({
      next: () => {
        console.log('Appointment updated');
        this.modalService.hideModal();
      },
      error: error => {
        this.httpErrors = error.error;
        console.log(error);
      }
    });

  }

  onDateChange() {
    console.log(this.selectedDate);
    this.getAvailableSlots(this.selectedDate);
    this.selectedSlot = null;
  }

  onBack() {
    this.modalService.hideModal();
}
}

