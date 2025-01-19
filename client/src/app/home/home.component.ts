import { Component, inject } from '@angular/core';
import { CalendarComponent } from "../calendar/calendar.component";
import { AvailableAppointmentsComponent } from "../available-appointments/available-appointments.component";
import { TimeComponent } from "../time/time.component";
import { ModalService } from '../_services/modal.service';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalendarComponent, AvailableAppointmentsComponent, TimeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  modalService = inject(ModalService);
  accountService = inject(AccountService);
}
