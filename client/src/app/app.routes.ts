import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
    {path:'', component:CalendarComponent},
    {path:'**', component:CalendarComponent, pathMatch: 'full'}
];
