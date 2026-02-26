import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NgxSpinnerComponent } from 'ngx-spinner';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [NgxSpinnerComponent, RouterLink, RouterLinkActive, NgbCollapse, FaIconComponent, RouterOutlet]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'maintenance-ui';
  loggedIn = false;
  navbarCollapsed = true;
  faSignOutAlt = faSignOutAlt;
  private readonly destroying$ = new Subject<void>();

  private msalBroadcastService = inject(MsalBroadcastService);
  private authService = inject(MsalService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe({
      next: () => this.setLoginDisplay()
    });
    this.setLoginDisplay();
    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this.destroying$)
    ).subscribe(() => this.setLoginDisplay());

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroying$)
    ).subscribe(() => {
      this.navbarCollapsed = true;
    });
  }

  ngOnDestroy() {
    this.destroying$.next();
    this.destroying$.complete();
  }

  private setLoginDisplay() {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  }

  logout() {
    this.authService.logout();
  }
}
