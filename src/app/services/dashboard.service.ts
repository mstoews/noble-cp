import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, Subject, defer, exhaustMap, from } from 'rxjs';
import { collection, query, orderBy, limit, addDoc, updateDoc } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { catchError, filter, map, retry } from 'rxjs/operators';

import { FIRESTORE } from 'app/app.config';
import { IDashboardFund } from 'app/models';
import { SendhttpService } from './sendhttp.service';
import { AuthService } from 'app/modules/auth/auth.service';


interface MessageState {
  dashboard: IDashboardFund[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);
  private authUser$ = toObservable(this.authService.user);
  private sendHttp = inject(SendhttpService)

  // sources
  messages$ = this.getAll().pipe(
    // restart stream when user re-authenticates
    retry({
      delay: () => this.authUser$.pipe(filter((user) => !!user)),
    })
  );
  add$ = new Subject<IDashboardFund['fund']>();
  error$ = new Subject<string>();
  logout$ = this.authUser$.pipe(filter((user) => !user));

  // state
  private state = signal<MessageState>({
    dashboard: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().dashboard);
  error = computed(() => this.state().error);

  constructor() {
    // reducers
    this.messages$.pipe(takeUntilDestroyed()).subscribe((messages) =>
      this.state.update((state) => ({
        ...state,
        messages,
      }))
    );

    this.add$
      .pipe(
        takeUntilDestroyed(),
        exhaustMap((message) => this.addMessage(message, 100, 'description'))
      )
      .subscribe({
        error: (err) => {
          console.log(err);
          this.error$.next('Failed to send message');
        },
      });

    this.logout$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, messages: [] }))
      );

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe((error) =>
        this.state.update((state) => ({ ...state, error }))
      );
  }
  
  private SendHttpRequest()
   {
     this.sendHttp.sendRequest();
   } 

  private getAll() {
      const messagesCollection = query(
        collection(this.firestore, 'messages'),
        orderBy('created', 'desc'),
        limit(50)
      );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse())
    ) as Observable<IDashboardFund[]>;
  }

  private addMessage(fund: string, value: number, desc: string) {
    const newFundValues = {
      fund: fund,
      amount: value,
      updatedTime: Date.now().toString(),  
      description: desc
    };
      
    const dashboardCollection = collection(this.firestore, 'dashboard');
    return defer(() => addDoc(dashboardCollection, newFundValues));
  }
}
