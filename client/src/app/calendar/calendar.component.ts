import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, map, of, skip } from 'rxjs';
import { AppointmentsService } from '../_services/appointments.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BsDatepickerModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  private router = inject(Router);
  private appointmentsService = inject(AppointmentsService)
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsInlineValue = new BehaviorSubject<Date>(new Date());
  bsInlineValue$ = this.bsInlineValue.asObservable();
  dateSelected = this.bsInlineValue$.pipe(skip(2));
  template:TemplateRef<void> | null = null

  constructor(){
    this.datePickerConfig = Object.assign({}, { showWeekNumbers: false})

  }


  onDateSelected(selected: Date, template: TemplateRef<void>){
    this.bsInlineValue.next(selected);
    this.template = template;
  }

  hideModal(){
    this.appointmentsService.hideModal();
  }

  ngOnInit(): void {
    this.dateSelected.subscribe({
      next: ()=> {
        console.log(this.bsInlineValue.value)
        if(this.template != null)
          this.appointmentsService.openModal(this.template);        
      }
    });
  }

}


