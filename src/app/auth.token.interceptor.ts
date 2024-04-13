import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from './token.service';
import { async } from 'rxjs';
import { environment } from 'environments/environment.prod'
import { inject } from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const baseUrl = environment.baseUrl
  const tokenService = inject(TokenService);
  var jwt: string;

  jwt = localStorage.getItem('token');
  tokenService.getToken().then((token) => {
    jwt = token
  });

 //const expired  = tokenService.isExpired() ? tokenService.getRefreshToken() : jwt;

  if (req.url.indexOf('oauthCallback') > -1) {
    return next(req)
  }

  if (req.url.startsWith(baseUrl)) {
    tokenService.getToken().then((token) => {
      jwt = token
    });
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
  }
  return next(req);

};
