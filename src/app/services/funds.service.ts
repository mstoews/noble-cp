import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, shareReplay } from 'rxjs';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { IFunds } from '../models';
import { environment } from 'environments/environment.prod';

interface FundState {
    types: IFunds[];
    error: string | null;
  }
  

@Injectable({
    providedIn: 'root',
})
export class FundsService {
  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  error$ = new Subject<string>();
  
  types = computed(() => this.state().types);
  error = computed(() => this.state().error);

  private state = signal<FundState>({
    types: [],
    error: null,
  });

  
  create(t: IFunds) {
    var url = this.baseUrl + '/v1/type_create';
    var email = this.authService.currentUser.email;  
    const dDate = new Date();
    
    var data: IFunds = {
        id: t.id,
        fund: t.fund,
        description: t.description,
        create_date: t.create_date,
        create_user: t.create_user,
        update_date: t.update_date,
        update_user: t.update_user
      
    }

    return this.httpClient.post<IFunds>(url, data).pipe(
      shareReplay())
  }


  // Read
  read() {
    var url = this.baseUrl + '/v1/funds_list';
    return this.httpClient.get<IFunds[]>(url).pipe(
      shareReplay())
  }

  // Update
  update(t: IFunds) {
    var url = this.baseUrl + '/v1/fund_create';

    var data: IFunds = {
        id: t.id,
        fund: t.fund,
        description: t.description,
        create_date: t.create_date,
        create_user: t.create_user,
        update_date: t.update_date,
        update_user: t.update_user
      
    }

    return this.httpClient.post<IFunds>(url, data).pipe(
      shareReplay())
  }

  // Delete
  delete(id: string) {
    var data = {
      type: id
    }
    var url = this.baseUrl + '/v1/fund_delete';
    return this.httpClient.post<IFunds[]>(url, data).pipe(
      shareReplay())
  }


}
