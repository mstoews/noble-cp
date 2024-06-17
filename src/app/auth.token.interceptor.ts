import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'environments/environment.prod'
import { inject } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';
import { Observable, catchError, debounceTime, of, switchMap, take } from 'rxjs';
import { Router } from '@angular/router';


const getHeaders = (): any => {
  const authService = inject(AuthService);
  const route = inject(Router);
  //  authorization here
  let headers: any = {};
  var _auth = authService.GetToken();
  console.debug('getting token ....', _auth);
  
  if (_auth === null)
    { 
      
      route.navigate(['auth/login']);
      
    }
  if (_auth && _auth !== '') {
    headers['Authorization'] = `Bearer ${_auth}`;
  }
  return headers;
};


export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const baseUrl = environment.baseUrl  

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
