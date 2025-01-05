import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { authGuard } from './_guards/auth.guard';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'my-appointments', component: MyAppointmentsComponent, canActivate:[authGuard]},
    {path:'**', component:HomeComponent, pathMatch: 'full'}
];
