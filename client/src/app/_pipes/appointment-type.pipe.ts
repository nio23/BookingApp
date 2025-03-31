import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../_models/appointment';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Pipe({
  name: 'appointmentType',
  standalone: true
})
export class AppointmentTypePipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  titleCasePipe = new TitleCasePipe();
  
  transform(value: Appointment): string {
    const date = this.datePipe.transform(value.date, 'medium', 'UTC+02:00');
    const name = 'clientName' in value ? value.clientName : value.user?.username;
  
    if(name === undefined)
      return `${date}`;

    const titlecase = this.titleCasePipe.transform(name);
    return `${date} - ${titlecase}`;

    
  }
}
