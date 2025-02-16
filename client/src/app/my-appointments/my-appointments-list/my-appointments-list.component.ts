import { Component, inject, input, model, OnInit } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { AppointmentsService } from '../../_services/appointment.service';
import { MyAppointment } from '../../_models/myAppointment';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../_services/modal.service';
import { AccountService } from '../../_services/account.service';
import { Appointment } from '../../_models/appointment';
import { AppointmentTypePipe } from '../../_pipes/appointment-type.pipe';

@Component({
  selector: 'app-my-appointments-list',
  standalone: true,
  imports: [CommonModule, AccordionComponent, AccordionPanelComponent, AppointmentTypePipe],
  templateUrl: './my-appointments-list.component.html',
  styleUrl: './my-appointments-list.component.css'
})
export class MyAppointmentsListComponent implements OnInit {
  appointmentService = inject(AppointmentsService);
  accountService = inject(AccountService)
  myAppointments = model<MyAppointment[] | Appointment[]>();
  modalService = inject(ModalService);

  ngOnInit(): void {
    if(!(this.myAppointments() === undefined))
      return;
    
    console.log('getting appointments');

    if(this.accountService.hasAdminRole()){
      this.getAppointments();
    }else{
      this.getMyAppointments();
    }

    this.appointmentService.appointmentDeleted.subscribe({
      next: (id:number) => {
        this.onAppointmentDeleted(id);
      }
    });
  }

  getAppointments(){
    this.appointmentService.getAppointments().subscribe({
      next: appointments => {
        this.myAppointments.set(appointments);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getMyAppointments(){
    this.appointmentService.getMyAppointments().subscribe({
      next: appointments => {
        this.myAppointments.set(appointments);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  changeAppointment(appointment: any) {
    this.modalService.openUpdateAppointmentModal(appointment);
  }



  openCancelConfirmationModal(appointment: any) {
    this.modalService.openCancelConfirmationModal(appointment);

  }

  onAppointmentDeleted(id: number) {
    this.myAppointments()?.map(() => {
      this.myAppointments()?.filter(x => x.id !== id);
    });
  }

  getHeading(appointment: MyAppointment | Appointment):string{
    //{{appointment.date | date: 'medium'}}
    if(this.accountService.hasAdminRole()){
      appointment = appointment as Appointment;
      return "{{appointment.date | date: 'medium'}} - {{appointment.user.username | titlecase}}";
    }else{
      appointment = appointment as MyAppointment;
      return "{{appointment.date | date: 'medium'}}";
    }
  }

  
  

}
