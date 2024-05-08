// FYI info, not using in this app, and better not use it, it fails the async
// pipe in SSR

import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from './auth.state';

const getHeaders = (): any => {
  const authState = inject(AuthState);
  //  authorization here
  let headers: any = {};
  const _auth = authState.GetToken();
  if (_auth && _auth !== '') {
    headers['authorization'] = `Bearer ${_auth}`;
  }

  return headers;
};

export const AppInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  // prefixing the api with proper value, mostly from config
  // remote config url are expected to filtered out, it would not make sense
  const url = 'https://saphire.sekrab.com/api' + req.url;

  const adjustedReq = req.clone({
    url: url,
    setHeaders: getHeaders(),
  });

  return next(adjustedReq);
};
