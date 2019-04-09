import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetComponent } from './fleet/fleet.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RecordMaintenanceComponent } from './record-maintenance/record-maintenance.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', redirectTo: '/fleet', pathMatch: 'full' },
  { path: 'fleet', component: FleetComponent, canActivate: [MsalGuard] },
  { path: 'addVehicle', component: AddVehicleComponent, canActivate: [MsalGuard] },
  { path: 'vehicle/:id', component: VehicleComponent, canActivate: [MsalGuard] },
  { path: 'recordMaintenance/:vehicleId', component: RecordMaintenanceComponent, canActivate: [MsalGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
