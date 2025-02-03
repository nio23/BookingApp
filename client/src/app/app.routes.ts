import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyAppointmentsListComponent } from './my-appointments/my-appointments-list/my-appointments-list.component';
import { authGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { AvailableAppointmentsComponent } from './available-appointments/available-appointments.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'availability', component: AvailableAppointmentsComponent},
    {path:'my-appointments', component: MyAppointmentsListComponent, canActivate:[authGuard]},
    {path:'register', component: RegisterComponent},
    {path:'**', component:HomeComponent, pathMatch: 'full'}
];
