import { Component, OnInit } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Router, NavigationEnd } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'maintenance-ui';
  loggedIn: boolean;
  isIframe: boolean;
  currentUrl: string;
  navbarCollapsed = true;
  faSignOutAlt = faSignOutAlt;

  constructor(private authService: MsalService, private router: Router,
    private broadcastService: BroadcastService) { }

  ngOnInit(): void {
    //  This is to avoid reload during acquireTokenSilent() because of hidden iframe
    this.isIframe = window !== window.parent && !window.opener;
    
    this.checkoutAccount();
    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkoutAccount();
    });
    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.navbarCollapsed = true;
      }
    });
  }

  private checkoutAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  logout() {
    this.authService.logout();
  }
}
