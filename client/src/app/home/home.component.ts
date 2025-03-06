import { Component, inject } from '@angular/core';
import { AvailableAppointmentsComponent } from "../available-appointments/available-appointments.component";
import { ModalService } from '../_services/modal.service';
import { AccountService } from '../_services/account.service';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AvailableAppointmentsComponent, CalendarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  modalService = inject(ModalService);
  accountService = inject(AccountService);
}
