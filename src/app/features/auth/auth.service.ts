import { Injectable, computed, inject, signal } from '@angular/core';
import { from, defer, switchMap, tap, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  confirmPasswordReset,
  signOut,
} from 'firebase/auth';
import { authState , idToken} from 'rxfire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Credentials } from 'app/shared/interfaces/credentials';
import { AUTH } from 'app/app.config';
// import { CacheService } from './cache.service';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);
  private token: BehaviorSubject<string> = new BehaviorSubject(null);
  token$: Observable<string> = this.token.asObservable();

  // sources
  private user$ = authState(this.auth);

  // state
  private state = signal<AuthState>({
    user: undefined,
    token: undefined
  });

  check() {    
      return of(true);     
  }

  // selectors
  public user = computed(() => this.state().user);
  authState: any;
  tokenSubject: Subject<string>;

  constructor() {
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
      }))
    );
    idToken(this.auth).subscribe({
      next: (token) => {
        this.UpdateState(token);
      },
    });
  }


  UpdateState(token: string) {
    localStorage.setItem('jwt', token);
    this.state().token = token;
    this.token.next(token);
  }


  refreshToken(): Observable<string> {
    idToken(this.auth).subscribe({
      next: (token) => {
        this.UpdateState(token);
      },
    });
    return of(this.GetToken());
  }


  unlockSession(credentials: Credentials){
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      ).pipe(
        // get the token
        switchMap((auth) => (<any>auth).user.getIdToken()),
        tap((token) => {
          // save state as well
          this.authState.UpdateState(token);
        })
    ));
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      ).pipe(
        // get the token
        switchMap((auth) => (<any>auth).user.getIdToken()),
        tap((token) => {
          // save state as well
          this.authState.UpdateState(token);
        })
    ));
  }

  resetPassword(oobCode: string, password: string ){
    return from (  defer(() =>
       confirmPasswordReset(
        this.auth,
        oobCode,
        password
      )
    ).pipe(
      // get the token
      switchMap((auth) => (<any>auth).user.getIdToken()),
      tap((token) => {
        // save state as well
        this.authState.UpdateState(token);
      })
    ));
  }

  logout() {
    signOut(this.auth);
  }

  GetToken() {
    return this.state().token;
  }

  
  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }
}
