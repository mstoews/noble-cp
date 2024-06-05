import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken,
  getAdditionalUserInfo
} from 'firebase/auth';
import { authState } from 'rxfire/auth';

import { tap, Observable, defer, switchMap, from } from 'rxjs';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private auth: Auth
  ) { 
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
      }))
    );
  }

  user = computed(() => this.state().user);

  private user$ = authState(this.auth);

  private state = signal<AuthState>({
    user: undefined,
  });

  // soliont I: keep it foreign
  Login(email: string, password: string): Observable<any> {
    // const res = () => signInWithEmailAndPassword(this.auth, email, password);
    // return defer(res).pipe(
    //   // get the token
    //   switchMap((auth) => (<any>auth).user.getIdToken()),
    //   tap((token) => {
    //     // save state as well
    //     this.authState.UpdateState(token);
    //   })
    // );
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth, email, password )
      )
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

  // Signup(email: string, password: string, custom: any): Observable<any> {
  //   // here send a sign up request, with extra params
  //   const res = () =>
  //     createUserWithEmailAndPassword(this.auth, email, password);

  //   // after creating the user, we need to send it back to our API to create custom claims
  //   return defer(res).pipe(
  //     // first IdToken
  //     switchMap(_ => getIdToken(this.user())
  //       idToken(this.auth)),
  //     tap((token: string) => {
  //       console.debug(token);
  //       // save state first
  //       this.authState.UpdateState(token);
  //     }),
  //     switchMap((_) => this.UpdateUser(custom))
  //   );
  // }

  UpdateUser(customClaims: any): Observable<any> {
    return this.http.post('/user', customClaims);
    // map to getTokenIdResults
  }

  public UserName(): string {
    return this.state().user.email
  }

}
