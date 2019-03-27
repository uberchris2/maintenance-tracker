import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private adalService: MsAdalAngular6Service) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.adalService.accessToken}`
            }
        });
        return next.handle(request);
    }
}