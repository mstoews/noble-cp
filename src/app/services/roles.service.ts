import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, catchError, of, shareReplay, take, tap, throwError } from 'rxjs';
import { signalState, patchState} from '@ngrx/signals'

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';



export interface IRole {
  role: string,
  description: string,
  update_date: Date,
  update_user: string
}

type RoleState = { role: IRole[], isAdmin: boolean }

@Injectable({
  providedIn: 'root',
})
export class RoleService {


  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  private roleState = signalState<RoleState>({role: [], isAdmin: false}); 
  
  error$ = new Subject<string>();

  private roleList = signal<IRole[]>([])

  create(t: IRole) {
    var url = this.baseUrl + '/v1/role_create';
    var email = this.authService.currentUser.email;
    const dDate = new Date();

    var data: IRole = {
      role: t.role,
      description: t.description,
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
      return this.roleList
  }
  
  createRoleSignal(role: IRole){
    this.roleList.update(item=> [...item, role]);
  }

  // Read
  read() {
    if (this.roleList().length === 0) {
      var url = this.baseUrl + '/v1/read_role';
      this.httpClient.get<IRole[]>(url).pipe(
        // tap(data => this.roleState.role.setroleList.set(data)),
        tap(data => patchState(this.roleState, (state) => ({...state.role, role: data}))),
        take(1),
        catchError(err => {
          const message = "Could not retrieve journals ...";
          console.debug(message, err);
          return throwError(() => new Error(`${JSON.stringify(err)}`));
        }),
        shareReplay()
      ).subscribe();
    }
    console.log(this.roleState.isAdmin());
    return this.roleState.role;
  }


  // Update
  update(t: IRole) {
    var url = this.baseUrl + '/v1/update_role';

    var data: IRole = {
      role: t.role,
      description: t.description,
      update_date: t.update_date,
      update_user: t.update_user
    }

    this.httpClient.get<IRole[]>(url).pipe(
      tap(data => this.updateRole(data)),
      take(1),
      catchError(err => {
        const message = "Could not retrieve journals ...";
        console.debug(message, err);
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay()
    ).subscribe();

    return this.roleList;
  }

  updateRole(data: any) {
  this.roleList.update(items => items.map(role => role.role === data.role  ? {
    role: data.role,
    description: data.description,
    update_date: data.update_date,
    update_user: data.update_user
    } : role))
  };

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

  deleteRoleSignal(role: IRole){
    this.roleList.update(items => items.filter(item => item.role != role.role));
  }


}
