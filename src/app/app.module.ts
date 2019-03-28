import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FleetComponent } from './fleet/fleet.component';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RecordMaintenanceComponent } from './record-maintenance/record-maintenance.component';
import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { AuthInterceptor } from './auth.interceptor';
import { FormsModule } from '@angular/forms';

export function getAdalConfig() {
  return {
      tenant: '1afbc838-c2c9-44f9-a3e1-b327d260aacd',
      clientId: 'bbefd485-0e5c-4546-b433-7130344b9e21',
      navigateToLoginRequestUrl: false,
    };
}

@NgModule({
  declarations: [
    AppComponent,
    FleetComponent,
    VehicleCardComponent,
    AddVehicleComponent,
    VehicleComponent,
    RecordMaintenanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    MsAdalAngular6Module.forRoot(getAdalConfig),
    FormsModule
  ],
  providers: [
    AuthenticationGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
