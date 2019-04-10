import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FleetComponent } from './fleet/fleet.component';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RecordMaintenanceComponent } from './record-maintenance/record-maintenance.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule } from "@azure/msal-angular";
import { MsalInterceptor } from "@azure/msal-angular";
import { Interceptor } from './interceptor';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { LogLevel } from 'msal';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

// export function loggerCallback(logLevel, message, piiEnabled) {
//   console.log("client logging" + message);
// }


export function getMsalConfig() {
  return {
    clientID: '4a74cf5a-08f1-43a6-be67-b30dbe68e4ff',
    authority: "https://maintenancetracker.b2clogin.com/tfp/maintenancetracker.onmicrosoft.com/B2C_1_sign_up_sign_in/",
    validateAuthority: false,
    redirectUri: environment.origin,
    cacheLocation: 'localStorage',
    postLogoutRedirectUri: environment.origin,
    navigateToLoginRequestUrl: true,
    popUp: false,
    // logger: loggerCallback,
    // level: LogLevel.Info,
    // piiLoggingEnabled: true
  };
}

@NgModule({
  declarations: [
    AppComponent,
    FleetComponent,
    VehicleCardComponent,
    AddVehicleComponent,
    VehicleComponent,
    RecordMaintenanceComponent,
    HomeComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    MsalModule.forRoot(getMsalConfig()),
    FormsModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
