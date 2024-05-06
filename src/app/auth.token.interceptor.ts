import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'environments/environment.prod'
import { inject } from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const baseUrl = environment.baseUrl
  const tokenService = inject(TokenService);
  var jwt: string;

  jwt = localStorage.getItem('token');
  if (req.url.startsWith(baseUrl)) {
    tokenService.getToken().then((token) => {
      jwt = token
      if (jwt !== undefined)
        {
          localStorage.setItem('token', jwt);
        }
    });
  }
  if (req.url.indexOf('oauthCallback') > -1) {
    return next(req)
  }

  if (req.url.startsWith(baseUrl)) { 
    if (jwt  === undefined) {
     tokenService.getToken().then((token) => {
        jwt = token
        // console.debug(jwt);
      });
    }
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
  }
  return next(req);

};
