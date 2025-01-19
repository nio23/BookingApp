import { Component } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-my-appointment-edit',
  standalone: true,
  imports: [BsDatepickerModule],
  templateUrl: './my-appointment-edit.component.html',
  styleUrl: './my-appointment-edit.component.css'
})
export class MyAppointmentEditComponent {

}
