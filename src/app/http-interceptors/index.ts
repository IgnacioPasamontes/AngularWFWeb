/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TimeoutInterceptor } from './timeout-interceptor';
import { DEFAULT_TIMEOUT } from './timeout-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
  { provide: DEFAULT_TIMEOUT, useValue: 300000 }
];
