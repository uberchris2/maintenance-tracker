import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'maintenance-ui';
  loggedIn = false;
  // isIframe: boolean;
  currentUrl: string;
  navbarCollapsed = true;
  faSignOutAlt = faSignOutAlt;
  private readonly destroying$ = new Subject<void>();

  constructor(private msalBroadcastService: MsalBroadcastService, private authService: MsalService,
    private router: Router) { }

  ngOnInit(): void {
    this.setLoginDisplay();
    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this.destroying$)
    ).subscribe(() => this.setLoginDisplay());

    // this.msalBroadcastService.msalSubject$.pipe(
    //   filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE),
    //   takeUntil(this.destroying$)
    // ).subscribe((result: EventMessage) => this.router.navigate(['unauthorized', result?.error?.message]));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.navbarCollapsed = true;
      }
    });
  }

  ngOnDestroy() {
    this.destroying$.next(null);
    this.destroying$.complete();
  }

  private setLoginDisplay() {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  }

  logout() {
    this.authService.logout();
  }
}
