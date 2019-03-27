import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetComponent } from './fleet/fleet.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RecordMaintenanceComponent } from './record-maintenance/record-maintenance.component';
import { AuthenticationGuard } from 'microsoft-adal-angular6';

const routes: Routes = [
  { path: '', redirectTo: '/fleet', pathMatch: 'full' },
  { path: 'fleet', component: FleetComponent, canActivate: [AuthenticationGuard] },
  { path: 'addVehicle', component: AddVehicleComponent, canActivate: [AuthenticationGuard] },
  { path: 'vehicle/:id', component: VehicleComponent, canActivate: [AuthenticationGuard] },
  { path: 'recordMaintenance', component: RecordMaintenanceComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
