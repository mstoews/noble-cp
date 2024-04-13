import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, ObservableInput, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: any;
    user$ = authState(this.auth);
    token: string;
    constructor( public auth: getAuth){

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        this.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((usr) => {
            this.user = usr;
            usr.getIdToken().then((token) => {
                this.token = token;
            });
        });

        if (this.token) {
            request = request.clone({
                setHeaders: { Authorization: `${this.token}` }
            });
        }

        return next.handle(request);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
