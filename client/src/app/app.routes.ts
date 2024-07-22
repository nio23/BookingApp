import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { DayComponent } from './day/day.component';

export const routes: Routes = [
    {path:'', component:CalendarComponent},
    {path:'day', component:DayComponent},
    {path:'**', component:CalendarComponent, pathMatch: 'full'}
];
