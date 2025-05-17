import { HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { retry, timer } from 'rxjs';

export const API_RETRY_COUNT = new HttpContextToken(() => environment.apiRetryCount);

export const retryInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    // If a retry count given by a context token is available - use that - otherwise fall back to a default from config
    const retryCount = req.context.get(API_RETRY_COUNT) || environment.apiRetryCount;

    return next(req).pipe(
        retry({
          count: retryCount,
          delay: (err, attemptNum) => {
            console.error(`[RetryInterceptor] => Encountered an error while retrying request on attempt ${attemptNum}: `, err)
            return timer(1000 * attemptNum);
          }
        }),
    );
};

