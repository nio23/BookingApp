import { inject, Pipe, PipeTransform } from '@angular/core';
import { MyAppointment } from '../_models/myAppointment';
import { Appointment } from '../_models/appointment';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Pipe({
  name: 'appointmentType',
  standalone: true
})
export class AppointmentTypePipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  titleCasePipe = new TitleCasePipe();
  
  transform(value: MyAppointment | Appointment): string {
    const date = this.datePipe.transform(value.date, 'medium');

    if('user' in value){
      const adminAppointment = value as Appointment;
      const titlecase = this.titleCasePipe.transform(adminAppointment.user?.username ?? 'Unknown User');
      return `${date} - ${titlecase}`;
    }

    return `${date}`;
    
  }
}
