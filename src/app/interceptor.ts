import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private spinner: NgxSpinnerService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinner.show();
        request = request.clone({
            url: `${environment.apiEndpoint}${request.url}`
        });
        return next.handle(request).pipe(
            finalize(() => {
                this.spinner.hide();
            }));
    }
}