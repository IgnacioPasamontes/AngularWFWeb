/* Copyright 2017-2019
Under CC BY-SA 4.0 license (https://creativecommons.org/licenses/by-sa/4.0/legalcode)
Adapted from Stack Overflow answer to Alexander Abakumov (https://stackoverflow.com/users/3345644/alexander-abakumov)
by Michael Ziluck (https://stackoverflow.com/users/3962524/michael-ziluck)
with help of Jota.Toledo (https://stackoverflow.com/users/5394220/jota-toledo),
RahulSingh (https://stackoverflow.com/users/2708210/rahul-singh),
Estus Flask (https://stackoverflow.com/users/3731501/estus-flask) and others' comments.
https://stackoverflow.com/a/45986060
Probably trivial and non-copyrighted.*/

import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
export const TIMEOUT_HEADER = 'ng_timeout';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get(TIMEOUT_HEADER) || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);
    if (req.headers.has(TIMEOUT_HEADER)) {
        req = req.clone({ headers: req.headers.delete(TIMEOUT_HEADER)});
    }
    if (timeoutValueNumeric === 0) {
      console.log('no-timeout');
      return next.handle(req)
    }
    return next.handle(req).pipe(timeout(timeoutValueNumeric));
  }
}
