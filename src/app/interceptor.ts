import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { environment } from '../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private spinner: NgxSpinnerService, private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinner.show();
        if (!request.url.startsWith("http")) {
            request = request.clone({
                url: `${environment.apiEndpoint}${request.url}`
            });
        }
        return next.handle(request).pipe(
            catchError(() => {
                this.router.navigateByUrl('/error');
                return EMPTY;
            }),
            finalize(() => this.spinner.hide()));
    }
}
