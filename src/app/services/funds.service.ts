import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IFunds } from '../models';
import { environment } from 'environments/environment.prod';



@Injectable({
  providedIn: 'root',
})
export class FundsService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  
  error$ = new Subject<string>();

  create(t: IFunds) {
    var url = this.baseUrl + '/v1/fund_create';
    return this.httpClient.post<IFunds>(url, t).pipe( shareReplay());
   }

  // Read
  read() {
    var url = this.baseUrl + '/v1/funds_list';
    return this.httpClient.get<IFunds[]>(url).pipe(shareReplay());
  }

  // Update
  update(t: IFunds) {
    var url = this.baseUrl + '/v1/fund_update';
    console.debug('update', JSON.stringify(t));
    return this.httpClient.post<IFunds>(url, t).pipe(shareReplay()); 
  }

  // Delete
  delete(id: string) {    
    var url = this.baseUrl + '/v1/fund_delete';
    return this.httpClient.post<IFunds[]>(url, id).pipe( shareReplay());
  }

}
