import { Injectable, inject } from '@angular/core';
import { AUTH } from './app.config';

@Injectable()
export class TokenService {
  auth = inject(AUTH)
  private token!: string

  constructor() { 
    this.getToken();
  }

  async getRefreshToken(): Promise<string> {
    var token =  await this.auth.currentUser?.getIdToken()
    localStorage.setItem('token', token);    
    this.token = token;
    return this.token;
  }

  async getToken(): Promise<string> {
    var token =  await this.auth.currentUser?.getIdToken()
    localStorage.setItem('token', token);  
    console.debug(token);  
    return token;    
  }

}