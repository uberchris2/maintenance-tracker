import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY } from 'rxjs';
import { environment } from '../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

let callCount = 0;

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const spinner = inject(NgxSpinnerService);
    const router = inject(Router);

    callCount++;
    spinner.show();
    if (!req.url.startsWith('http')) {
        req = req.clone({
            url: `${environment.apiEndpoint}${req.url}`
        });
    }
    return next(req).pipe(
        catchError(() => {
            router.navigateByUrl('/error');
            return EMPTY;
        }),
        finalize(() => {
            callCount--;
            if (callCount === 0)
                spinner.hide();
        }));
};
