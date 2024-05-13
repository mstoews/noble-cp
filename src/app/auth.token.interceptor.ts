import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'environments/environment.prod'
import { inject } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';
import { catchError, switchMap } from 'rxjs';

const getHeaders = (): any => {
  const authState = inject(AuthService);
  //  authorization here
  let headers: any = {};
  const _auth = authState.GetToken();
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
  return next(req).pipe(
    catchError ( error => {  
      if (error.status === 401) {
        // Unauthorized - JWT Token expired
        return authService.refreshToken().pipe(
          switchMap((tokenReceived) => {            
            let token : String = tokenReceived;
            if (token != '') {
              req = req.clone({
                setHeaders: {
                  'Accept' : 'application/json',
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
