import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const url = req.url;
    console.log('Intercepted request: ');
    console.table(req, ["method", "url", "body", "headers", "params", "responseType"]);

    return next(req).pipe(
        tap(httpEvent => {
            if (httpEvent instanceof HttpResponse) {
                console.log(`Logging HTTP Response: `)
                console.table(httpEvent, ["url", "status", "statusText", "body"]);
            }
        }),
        finalize(() => {
            console.log(`Request completed => ${url}`)
        })
    );
};
