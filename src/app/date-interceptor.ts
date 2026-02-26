import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?([+-]\d\d:\d\d|Z)?$/;

function isIso8601(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  return iso8601.test(value as string);
}

function convertToDate(body: unknown): void {
  if (body === null || body === undefined || typeof body !== 'object') {
    return;
  }
  for (const key of Object.keys(body as object)) {
    const value = (body as Record<string, unknown>)[key];
    if (isIso8601(value)) {
      (body as Record<string, unknown>)[key] = new Date(value as string);
    } else if (typeof value === 'object') {
      convertToDate(value);
    }
  }
}

export const dateInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        convertToDate(event.body);
      }
    })
  );
};
