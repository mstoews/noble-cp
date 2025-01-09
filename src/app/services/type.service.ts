import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, catchError, of, shareReplay, take, tap, throwError } from 'rxjs';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { IGLType } from 'app/models/types';


@Injectable({
  providedIn: 'root',
})
export class TypeService {

  // imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);

  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  error$ = new Subject<string>();

  public typeList = signal<IGLType[]>([])

  create(t: IGLType) {
    var url = this.baseUrl + '/v1/type_create';
    t.create_date = new Date().toISOString().split('T')[0];
    t.update_date = new Date().toISOString().split('T')[0];
    t.create_user = '@' + this.authService.currentUser.email.split('@')[0];
    t.update_user = '@' + this.authService.currentUser.email.split('@')[0];
  
    return this.httpClient.post<IGLType>(url, t).pipe( shareReplay())
  }

  // Read
  read() {
      var url = this.baseUrl + '/v1/type_list';
      return this.httpClient.get<IGLType[]>(url).pipe(shareReplay());
  }


  // Update
  update(t: IGLType) {
    var url = this.baseUrl + '/v1/type_create';

    var data: IGLType = {
      gltype: t.gltype,      
      description: t.description,
      create_date: t.create_date,
      create_user: t.create_user,
      update_date: t.update_date,
      update_user: t.update_user,
    }

    return this.httpClient.post<IGLType>(url, data).pipe(
      shareReplay())
  }

  // Delete
  delete(id: string) {
    var data = {
      type: id
    }
    var url = this.baseUrl + '/v1/type_list';
    return this.httpClient.post<IGLType[]>(url, data).pipe(
      shareReplay())
  }

}

export interface TypeStateInterface {
  type: IGLType[];
  isLoading: boolean;
  error: string | null;
}

export const TypeStore = signalStore(
  { protectedState: false }, withState<TypeStateInterface>({
    type: [],
    error: null,
    isLoading: false,
  }),
  withMethods((state, typeService = inject(TypeService)) => ({       
    loadType: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return typeService.read().pipe(
            tapResponse({
              next: (type) => patchState(state, { type: type }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadType();
    },
  })
);
