import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { MyAppointmentsListComponent } from './my-appointments/my-appointments-list/my-appointments-list.component';
import { authGuard } from './_guards/auth.guard';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'my-appointments', component: MyAppointmentsListComponent, canActivate:[authGuard]},
    {path:'**', component:HomeComponent, pathMatch: 'full'}
];
