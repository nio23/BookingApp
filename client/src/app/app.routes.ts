import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'**', component:HomeComponent, pathMatch: 'full'}
];
