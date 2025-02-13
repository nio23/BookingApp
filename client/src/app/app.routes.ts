import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyAppointmentsListComponent } from './my-appointments/my-appointments-list/my-appointments-list.component';
import { authGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { AvailableAppointmentsComponent } from './available-appointments/available-appointments.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ScheduleComponent } from './admin/schedule/schedule.component';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'availability', component: AvailableAppointmentsComponent},
    {path:'my-appointments', component: MyAppointmentsListComponent, canActivate:[authGuard]},
    {path:'register', component: RegisterComponent},
    {path:'server-error', component: ServerErrorComponent},
    {path:'not-found', component: NotFoundComponent},
    {path:'schedule', component: ScheduleComponent, canActivate:[authGuard, adminGuard]},
    {path:'**', component:HomeComponent, pathMatch: 'full'}
];
