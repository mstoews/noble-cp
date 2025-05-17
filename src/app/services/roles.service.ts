import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, catchError, exhaustMap, of, pipe, shareReplay, take, tap, throwError } from 'rxjs';
import { signalState, patchState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

export interface IRole {
  role: string,
  description: string,
  permission: string,
  update_date: Date,
  update_user: string
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  // Read  
  read() {
    var url = this.baseUrl + '/v1/read_roles';
    return this.httpClient.get<IRole[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  // Create
  create(t: IRole) {
    var url = this.baseUrl + '/v1/create_role';
    var email = this.authService.currentUser.email;
    const dDate = new Date();

    var data: IRole = {
      role: t.role,
      description: t.description,
      permission: t.permission,
      update_date: dDate,
      update_user: email,
    }
    return this.httpClient.post<IRole>(url, data).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  // Update
  update(t: IRole) {
    var url = this.baseUrl + '/v1/update_role';

    var data: IRole = {
      role: t.role,
      description: t.description,
      permission: t.permission,
      update_date: t.update_date,
      update_user: t.update_user
    }
    return this.httpClient.post<IRole[]>(url, t).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  // Delete
  delete(id: string) {
    var url = this.baseUrl + '/v1/delete_role/' + id;
    return this.httpClient.delete<IRole>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

}
