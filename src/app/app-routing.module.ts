import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetComponent } from './fleet/fleet.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RecordMaintenanceComponent } from './record-maintenance/record-maintenance.component';

const routes: Routes = [
  { path: '', redirectTo: '/fleet', pathMatch: 'full' },
  { path: 'fleet', component: FleetComponent },
  { path: 'addVehicle', component: AddVehicleComponent },
  { path: 'vehicle/:id', component: VehicleComponent },
  { path: 'recordMaintenance', component: RecordMaintenanceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }