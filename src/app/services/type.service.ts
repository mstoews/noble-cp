import { Injectable, inject } from '@angular/core';
import { Subject, shareReplay } from 'rxjs';
import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IGLType } from 'app/models/types';

@Injectable({
  providedIn: 'root',
})
export class TypeService {  

  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  error$ = new Subject<string>();

  // create
  create(t: IGLType) {
    var url = this.baseUrl + '/v1/type_create';
    t.create_date = new Date().toISOString().split('T')[0];
    t.update_date = new Date().toISOString().split('T')[0];
    t.create_user = '@' + this.authService.currentUser.email.split('@')[0];
    t.update_user = '@' + this.authService.currentUser.email.split('@')[0]
    return this.httpClient.post<IGLType>(url, t).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  // Read
  read() {
    var url = this.baseUrl + '/v1/type_list';
    return this.httpClient.get<IGLType[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  // Update
  update(t: IGLType) {
    var url = this.baseUrl + '/v1/type_update';
    var data: IGLType = {
      gltype: t.gltype,
      description: t.description,
      create_date: t.create_date,
      create_user: t.create_user,
      update_date: t.update_date,
      update_user: t.update_user,
    }

    return this.httpClient.post<IGLType>(url, data).pipe(
      shareReplay({ bufferSize: 1, refCount: true }))
  }

  
  // Delete
  delete(id: string) {
    var data = {
      type: id
    }
    var url = this.baseUrl + '/v1/type_delete';
    return this.httpClient.post<IGLType[]>(url, data).pipe(
      shareReplay({ bufferSize: 1, refCount: true }))
  }

}

