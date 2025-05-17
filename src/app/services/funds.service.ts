import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IFunds } from 'app/models';



@Injectable({
  providedIn: 'root',
})
export class FundsService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  error$ = new Subject<string>();

  create(t: IFunds) {
    var url = this.baseUrl + '/v1/fund_create';
    return this.httpClient.post<IFunds>(url, t).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  // Read
  read() {
    var url = this.baseUrl + '/v1/funds_list';
    return this.httpClient.get<IFunds[]>(url).pipe(shareReplay());
  }

  readDropdown() {
    var url = this.baseUrl + '/v1/funds_dropdown';
    return this.httpClient.get<IFunds[]>(url).pipe(shareReplay());
  }

  // Update
  update(t: IFunds) {
    var url = this.baseUrl + '/v1/fund_update';
    console.debug('update', JSON.stringify(t));
    return this.httpClient.post<IFunds>(url, t).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  // Delete
  delete(id: string) {
    var url = this.baseUrl + `/v1/fund_delete/'{id}'`;
    return this.httpClient.delete<IFunds[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

}
