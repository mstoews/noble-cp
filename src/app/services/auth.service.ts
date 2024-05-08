import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  idToken,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from '@angular/fire/auth';

import { tap, Observable, defer, switchMap } from 'rxjs';

import { AuthState } from './auth.state';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private authState: AuthState,
    private auth: Auth
  ) {}

  // soliont I: keep it foreign
  Login(email: string, password: string): Observable<any> {
    const res = () => signInWithEmailAndPassword(this.auth, email, password);
    return defer(res).pipe(
      // get the token
      switchMap((auth) => (<any>auth).user.getIdToken()),
      tap((token) => {
        // save state as well
        this.authState.UpdateState(token);
      })
    );
  }
  LoginGoogle(): any {
    // cannot implement this in stackblitz
    const provider = new GoogleAuthProvider();
    const res = () =>
      signInWithPopup(this.auth, provider).then((userCredential) => {
        const info = getAdditionalUserInfo(userCredential);
        return info.isNewUser;
      });
    return defer(res);
  }

  Signup(email: string, password: string, custom: any): Observable<any> {
    // here send a sign up request, with extra params
    const res = () =>
      createUserWithEmailAndPassword(this.auth, email, password);

    // after creating the user, we need to send it back to our API to create custom claims
    return defer(res).pipe(
      // first IdToken
      switchMap(_ => idToken(this.auth)),
      tap((token: string) => {
        console.log(token);
        // save state first
        this.authState.UpdateState(token);
      }),
      switchMap((_) => this.UpdateUser(custom))
    );
  }

  UpdateUser(customClaims: any): Observable<any> {
    return this.http.post('/user', customClaims);
    // map to getTokenIdResults
  }
}
