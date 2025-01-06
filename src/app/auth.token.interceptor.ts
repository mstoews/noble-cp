import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'environments/environment.prod'
import { inject } from '@angular/core';

import { Observable, catchError, debounceTime, of, switchMap, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './features/auth/auth.service';

const getHeaders = (): any => {
  const authService = inject(AuthService);
  const route = inject(Router);
  var jwt: string;
  let headers: any = {};

  var jwt = localStorage.getItem('jwt').trim();
  var tk: string;

  var subject = authService.refreshToken().subscribe((token) => {
    tk = token;
  });

  if (jwt === null || jwt === undefined) {
    route.navigate(['auth/login']);
  }
  if (jwt !== tk) {
    jwt = tk;
  }

  if (jwt !== '') {

    headers['Authorization'] = `Bearer ${jwt}`;
  }
  return headers;
};

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.baseUrl
  var token: any = {};

  if (req.url.indexOf('oauthCallback') > -1) {
    return next(req)
  }

  if (req.url.startsWith(baseUrl)) {
    req = req.clone({
      setHeaders: getHeaders(),
    });
    return next(req)
  }

  return next(req)

  // var authToken: Observable<string>;

  // const user = authService.user();
  // if (user === undefined) {
  //   console.debug('User is undefined ...');
  //   return next(req);
  // }

  // user.getIdToken().then( data => {
  //    authToken = of(data)     
  // });

  // if (authToken === undefined){
  //   return next(req);
  // }

  // return next(req).pipe(
  //   catchError ( error => {  
  //     if (error.status === 401) {
  //       // Unauthorized - JWT Token expired        
  //       return authService.authState.pipe(
  //         take(1),
  //         debounceTime(500),
  //         switchMap((tokenReceived) => {                        
  //           if (tokenReceived !== null) {
  //             localStorage.setItem('token', tokenReceived as string)
  //           }
  //           if (tokenReceived  != '') {
  //             req = req.clone(req)
  //               setHeaders: {
  //                 'Content-Type' : 'application/json',
  //                 "user-agent": "nobleledger",
  //                 'Authorization' : `Bearer ${token}`,
  //               },
  //             })
  //         }
  //           return next(req);
  //       })
  //   )}
  //   })
  // )
}
