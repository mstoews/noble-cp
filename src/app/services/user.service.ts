import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IUser } from 'app/models/user';
import { retry, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  read() {
    var url = this.baseUrl + "/v1/read_user";
    return this.httpClient.get<IUser[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  delete(uid: string) {
    var url = this.baseUrl + "/v1/delete_user";
    return this.httpClient.post<IUser[]>(url, { user: uid }).pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  create(user: IUser) {
    var url = this.baseUrl + "/v1/create_user";
    return this.httpClient.post<IUser>(url, { user: user }).pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  update(user: IUser) {
    var url = this.baseUrl + "/v1/update_user";
    return this.httpClient.post<IUser[]>(url, { user: user }).pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

}
