import { Injectable, inject } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';

@Injectable()
export class TokenService {
  auth = inject(AuthService)
  private token!: string

  constructor() { 
    this.getToken();
  }

  async getRefreshToken(): Promise<string> {
    var token =  await this.auth.user().getIdToken()
    localStorage.setItem('token', token);    
    this.token = token;
    return this.token;
  }

  async getToken(): Promise<string> {
    var token =  await this.auth.user().getIdToken()
    localStorage.setItem('token', token);  
    console.debug(token);  
    return token;    
  }

}