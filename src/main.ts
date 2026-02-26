import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { apiInterceptor } from './app/interceptor';
import { dateInterceptor } from './app/date-interceptor';
import {
  MsalModule, MsalInterceptor, MsalGuardConfiguration, MsalInterceptorConfiguration,
  MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalService, MsalGuard, MsalBroadcastService
} from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, InteractionType } from '@azure/msal-browser';
import { environment } from './environments/environment';

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
    system: {}
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

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(MsalModule, NgxSpinnerModule),
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    provideHttpClient(withInterceptors([apiInterceptor, dateInterceptor]), withInterceptorsFromDi()),
    provideAnimations()
  ]
}).catch(err => console.error(err));
