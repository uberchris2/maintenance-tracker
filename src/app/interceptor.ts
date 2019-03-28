import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { environment } from '../environments/environment';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private adalService: MsAdalAngular6Service) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.adalService.accessToken}`
            },
            url: `${environment.apiEndpoint}${request.url}`
        });
        return next.handle(request);
    }
}