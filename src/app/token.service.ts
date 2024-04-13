import { Injectable, inject } from '@angular/core';

import { AUTH } from './app.config';
import { jwtDecode }from 'jwt-decode';

@Injectable()
export class TokenService {
  auth = inject(AUTH)
  private token!: string

  constructor() {
    this.auth.currentUser?.getIdToken().then( (token) => {
      this.token = token;
      localStorage.setItem('token', token);
    })
  }

  async getRefreshToken(): Promise<string> {
    var token =  await this.auth.currentUser?.getIdToken()
    localStorage.setItem('token', token);
    this.token = token;
    return this.token;
  }

  async  isExpired(): Promise<boolean> {
    var token =  this.getToken();
    if (token === null) {
      return true;
    }
    token.then((jwt) => {
        var tokenInfo = jwtDecode(jwt); // decode token
        console.log(tokenInfo); // show decoded token object in console
        const expireDate = tokenInfo.exp; // get token expiration dateTime
        if (expireDate === undefined) {
            return true;
        }
    });
  }

  async getToken(): Promise<string> {
    var token =  await this.auth.currentUser?.getIdToken()
    localStorage.setItem('token', token);
    console.debug(token);
    return token;
  }

}
