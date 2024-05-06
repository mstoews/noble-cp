import { Injectable, computed, inject, signal } from '@angular/core';
import { from, defer, Observable, of } from 'rxjs';
import {
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { Credentials } from '../interfaces/credentials';
import { AUTH } from 'app/app.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CacheService } from 'app/common/cache.service';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);
  private cacheService = inject(CacheService);
  
  // sources
  private user$ = authState(this.auth);

  // state
  private state = signal<AuthState>({
    user: undefined,
  });

  // selectors
  user = computed(() => {
    return this.state().user
  });

  
  // If the access token exists, and it didn't expire, sign in using it
  constructor() {
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
      }))
    );    
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  logout() {
    this.cacheService.removeItem('token');
    signOut(this.auth);
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

  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return of(true);
  }

  resetPassword(email: string): boolean {
    sendPasswordResetEmail(this.auth, email).then(() => {
      // Password reset email sent!
      return true
    });
    return false;
  }
}
