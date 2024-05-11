import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'environments/environment.prod'
import { inject } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';

const getHeaders = (): any => {
  const authState = inject(AuthService);
  //  authorization here
  let headers: any = {};
  const _auth = authState.GetToken();
  if (_auth && _auth !== '') {
    headers['Authorization'] = `Bearer ${_auth}`;
  }

  return headers;
};



export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const baseUrl = environment.baseUrl
  // const tokenService = inject(TokenService);
  // var jwt: string;

  // jwt = localStorage.getItem('token');
  // if (req.url.startsWith(baseUrl)) {
  //   tokenService.getToken().then((token) => {
  //     jwt = token
  //     if (jwt !== undefined)
  //       {
  //         localStorage.setItem('token', jwt);
  //       }
  //   });
  // }
   if (req.url.indexOf('oauthCallback') > -1) {
     return next(req)
   }

  if (req.url.startsWith(baseUrl)) { 
    req = req.clone({
      setHeaders: getHeaders(),
    });
  }
  return next(req);

};
