import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FleetComponent } from './fleet/fleet.component';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';

@NgModule({
  declarations: [
    AppComponent,
    FleetComponent,
    VehicleCardComponent,
    AddVehicleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
