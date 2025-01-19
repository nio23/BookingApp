import { Component, inject } from '@angular/core';
import { ModalService } from '../../_services/modal.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-update-my-appointment',
  standalone: true,
  imports: [BsDatepickerModule],
  templateUrl: './update-my-appointment.component.html',
  styleUrl: './update-my-appointment.component.css'
})
export class UpdateMyAppointmentComponent {
  modalService = inject(ModalService);

}
