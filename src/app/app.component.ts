import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maintenance-ui';
  loggedIn: boolean;
  isIframe: boolean;
  currentUrl= '';

  constructor(private authService: MsalService, private router: Router) {
    //  This is to avoid reload during acquireTokenSilent() because of hidden iframe
    this.isIframe = window !== window.parent && !window.opener;
    if (this.authService.getUser()) {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    })
  }

  logout() {
    this.authService.logout();
  }
}
