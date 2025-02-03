import { Component, inject } from '@angular/core';
import { AvailableAppointmentsComponent } from "../available-appointments/available-appointments.component";
import { ModalService } from '../_services/modal.service';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ AvailableAppointmentsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  modalService = inject(ModalService);
  accountService = inject(AccountService);
}
