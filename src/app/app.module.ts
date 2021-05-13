import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule, NgbPopoverModule, NgbProgressbarModule, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FleetComponent } from './fleet/fleet.component';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RecordMaintenanceComponent } from './record-maintenance/record-maintenance.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './interceptor';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import {
  MsalModule, MsalInterceptor, MsalGuardConfiguration, MsalInterceptorConfiguration, MSAL_INSTANCE, MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG, MsalService, MsalGuard, MsalBroadcastService, MsalRedirectComponent
} from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, LogLevel, InteractionType } from '@azure/msal-browser';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ErrorComponent } from './error/error.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FeedbackComponent } from './feedback/feedback.component';
import { UpdateVehicleComponent } from './update-vehicle/update-vehicle.component';
import { ShareComponent } from './share/share.component';
import { OverwriteReceiptModalComponent } from './overwrite-receipt-modal/overwrite-receipt-modal.component';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { DateInterceptor } from './date-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export function loggerCallback(logLevel, message, piiEnabled) {
  console.log("client logging: " + message);
}


export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '4a74cf5a-08f1-43a6-be67-b30dbe68e4ff',
      authority: 'https://maintenancetracker.b2clogin.com/tfp/maintenancetracker.onmicrosoft.com/B2C_1_sign_up_sign_in/',
      redirectUri: '/',
      knownAuthorities: ['maintenancetracker.b2clogin.com']
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: true
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(`${environment.apiEndpoint}*`, ['https://maintenancetracker.onmicrosoft.com/4a74cf5a-08f1-43a6-be67-b30dbe68e4ff/user_impersonation']);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['https://maintenancetracker.onmicrosoft.com/4a74cf5a-08f1-43a6-be67-b30dbe68e4ff/user_impersonation']
    }
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
    PrivacyPolicyComponent,
    ErrorComponent,
    FeedbackComponent,
    UpdateVehicleComponent,
    ShareComponent,
    OverwriteReceiptModalComponent,
    ConfirmDeleteModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    MsalModule,
    FormsModule,
    NgxSpinnerModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true },
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  entryComponents: [
    OverwriteReceiptModalComponent,
    ConfirmDeleteModalComponent
  ]
})
export class AppModule {
  constructor() {
  }
}
