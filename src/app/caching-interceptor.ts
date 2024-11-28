import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

// A simple, in-memory cache where the keys are request URLs and the values are HTTPResponse objects containing JSON
const IN_MEMORY_CACHE: {[url: string]: HttpResponse<any>} = {};

export const jsonCachingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    // Ignore requests that are not for JSON
    if (req.responseType !== 'json') return next(req);

    // Return our cached JSON if we have some
    const cacheEntry: HttpResponse<any> | undefined = IN_MEMORY_CACHE[req.url]
    if (cacheEntry) {
        console.log("[JSONCachingInterceptor] => Returning cached response!");
        return of(cacheEntry);
    }

    // Otherwise make the request!
    return next(req).pipe(
        tap(httpEvent => {
            // Make sure we cache the response
            if (httpEvent instanceof HttpResponse) {
                IN_MEMORY_CACHE[req.url] = httpEvent;
            }
        })
    );
};


