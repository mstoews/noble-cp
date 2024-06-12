import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'environments/environment.prod'
import { inject } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';
import { Observable, catchError, debounceTime, of, switchMap, take } from 'rxjs';

const getHeaders = (): any => {
  const authService = inject(AuthService);
  //  authorization here
  let headers: any = {};
  const _auth = authService.GetToken();
  console.debug(_auth);
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
  }

  var authToken: Observable<string>;

  const user = authService.user();
  if (user === undefined) {
    console.debug('User is undefined ...');
    return next(req);
  }

  user.getIdToken().then( data => {
     authToken = of(data)     
  });

  if (authToken === undefined){
    return next(req);
  }
  
  
  return next(req).pipe(
    catchError ( error => {  
      if (error.status === 401) {
        // Unauthorized - JWT Token expired        
        return authToken.pipe(
          take(1),
          debounceTime(500),
          switchMap((tokenReceived) => {            
            let token : string = tokenReceived;
            if (token !== null) {
              localStorage.setItem('token', token)
            }
            if (token != '') {
              req = req.clone({
                setHeaders: {
                  'Content-Type' : 'application/json',
                  "user-agent": "nobleledger",
                  'Authorization' : `Bearer ${token}`,
                },
              })
          }
            return next(req);
        })
    )}
    })
  )
}
