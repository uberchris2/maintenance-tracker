import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetComponent } from './fleet/fleet.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RecordMaintenanceComponent } from './record-maintenance/record-maintenance.component';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ErrorComponent } from './error/error.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'fleet', component: FleetComponent, canActivate: [MsalGuard] },
  { path: 'addVehicle', component: AddVehicleComponent, canActivate: [MsalGuard] },
  { path: 'vehicle/:id', component: VehicleComponent, canActivate: [MsalGuard] },
  { path: 'recordMaintenance/:vehicleId', component: RecordMaintenanceComponent, canActivate: [MsalGuard] },
  { path: 'privacyPolicy', component: PrivacyPolicyComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'feedback', component: FeedbackComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
