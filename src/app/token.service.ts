import { Injectable, inject } from '@angular/core';

import { AUTH } from './app.config';
import { jwtDecode }from 'jwt-decode';

@Injectable()
export class TokenService {
  auth = inject(AUTH)
  private token!: string

  async getRefreshToken(): Promise<string> {
    await sleep(500);
    var token =  await this.auth.currentUser?.getIdToken()
    localStorage.setItem('token', token);
    this.token = token;
    return this.token;
  }

  async  isExpired(): Promise<boolean> {
    var token =  await this.getToken();
    if (token === null) {
      return false;
    }
    
    var tokenInfo = await jwtDecode(token); // decode token
    console.log(tokenInfo); // show decoded token object in console
    const expireDate = tokenInfo.exp; // get token expiration dateTime
     if (expireDate === undefined) {
        return false;    
     }
     return true;
  }

  async getToken(): Promise<string> {
    var token =  await this.auth.currentUser?.getIdToken()
    localStorage.setItem('token', token);
    console.debug(token);
    return token;
  }

}

async function sleep(ms : number ) {
  return new Promise(resolve => 
    setTimeout(resolve, ms));
}

