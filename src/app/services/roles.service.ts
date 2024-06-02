import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, catchError, exhaustMap, of, pipe, shareReplay, take, tap, throwError } from 'rxjs';
import { signalState, patchState} from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';

export interface IRole {
  role: string,
  description: string,
  permission: string,
  update_date: Date,
  update_user: string
}

type RoleState = { role: IRole[], isLoading: boolean }

const initialState : RoleState = {
  role: [],
  isLoading: false,
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  private roleState = signalState(initialState); 
  readonly roleList = this.roleState.role;
  readonly isLoading = this.roleState.isLoading;

  error$ = new Subject<string>();
  
  readUrl = this.baseUrl + '/v1/read_roles';

  readonly read = rxMethod <void>  (
    pipe(
      tap(() => patchState(this.roleState, { isLoading: true })),
      exhaustMap(() => {
        return this.httpClient.get<IRole[]>(this.readUrl).pipe(
          tapResponse({
            next: (role) => patchState(this.roleState, { role }),
            error: console.error,
            finalize: () => patchState(this.roleState, { isLoading: false }),
          })
        );
      })
    )
  );
  

  create(t: IRole) {
    var url = this.baseUrl + '/v1/role_create';
    var email = this.authService.currentUser.email;
    const dDate = new Date();

    var data: IRole = {
      role: t.role,
      description: t.description,
      permission: t.permission,
      update_date: dDate,
      update_user: email,
    }

      this.httpClient.post<IRole>(url, data).pipe(
        tap(data => this.createRoleSignal(data)),
        take(1),
        catchError(err => {
          const message = "Could not retrieve journals ...";
          console.debug(message, err);
          return throwError(() => new Error(`${JSON.stringify(err)}`));
        }),
        shareReplay()
      ).subscribe();
      return this.roleState.role
  }
  
  createRoleSignal(role: IRole){
    patchState(this.roleState, (state) => ({ 
      role: {...state.role, role } 
    }))    
  }


  update(t: IRole) {
    var url = this.baseUrl + '/v1/update_role';

    var data: IRole = {
      role: t.role,
      description: t.description,
      permission: t.permission,
      update_date: t.update_date,
      update_user: t.update_user
    }

    this.httpClient.post<IRole>(url, t).pipe(
      tap(data => this.updateRole(data)),
      take(1),
      catchError(err => {
        const message = "Could not retrieve journals ...";
        console.debug(message, err);
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay()
    ).subscribe();

    return this.roleState.role;
  }

  updateRole(data: IRole) {
    this.roleState.role().map(item => item.role === data.role ? item: data );    
  }

  // Delete
  delete(id: string) {
    var data = {
      role: id
    }
    var url = this.baseUrl + '/v1/delete_role';
    return this.httpClient.post<IRole>(url, data).pipe(
      tap(data => this.deleteRoleSignal(data)),
      take(1),
      catchError(err => {
        const message = "Could not retrieve journals ...";
        console.debug(message, err);
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay()
    ).subscribe();
  }

  deleteRoleSignal(data: IRole){
    this.roleState.role().filter(item => item.role != data.role);
    patchState(this.roleState, (state) => (
      {
        ...state.role,
        role:  state.role.filter(role => role.role !== data.role),
        isLoading: false,
        error: ''
      }
    ));      
  }

}
