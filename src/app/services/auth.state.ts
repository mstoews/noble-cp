import { Injectable } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthState {
  // create an internal subject and an observable to keep track
  private token: BehaviorSubject<string> = new BehaviorSubject(null);
  token$: Observable<string> = this.token.asObservable();

  constructor(private auth: Auth) {
    // set the stateItem to that of idToken
    idToken(this.auth).subscribe({
      next: (token) => {
        this.UpdateState(token);
      },
    });
  }

  GetToken() {
    return this.token.getValue();
  }

  UpdateState(token: string) {
    this.token.next(token);
  }
}
