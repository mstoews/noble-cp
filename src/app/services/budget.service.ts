import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { Timestamp } from 'firebase/firestore';
import { AUTH } from 'app/app.config';


import { ISubType } from 'app/services/subtype.service';
import { IAccounts } from 'app/models/journals';
import { IBudget, IFunds } from 'app/models';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  // Create 
  create(t: IBudget) {
    var url = this.baseUrl + '/v1/create_budget_amt';
    var email = this.authService.currentUser.email;
    var name = email.substring(0, email.lastIndexOf("@"));
    const dDate = Timestamp.fromDate(new Date());

    const budget = {
      ...t,
      transaction_date: dDate,
      create_user: name      
    }

    return this.httpClient.post<IBudget>(url, budget)
  }

  // Read
  read() {
    var url = this.baseUrl + '/v1/read_budget_amt';
    return this.httpClient.get<IBudget[]>(url)
  }

  readTypes() {
    var url = this.baseUrl + '/v1/read_types';
    return this.httpClient.get<IType[]>(url)
  }

  readAccounts() {
    var url = this.baseUrl + '/v1/read_accounts';
    return this.httpClient.get<IAccounts[]>(url)
  }

  readSubtypes() {
    var url = this.baseUrl + '/v1/read_subtypes';
    return this.httpClient.get<ISubType[]>(url)
  }

  readFunds() {
    var url = this.baseUrl + '/v1/read_funds';
    return this.httpClient.get<IFunds[]>(url)
  }

  // Update
  update(t: IBudget) {
    var url = this.baseUrl + '/v1/update_budget_amt';
    return this.httpClient.post<IBudget>(url, t)
  }

  // Delete
  delete(child: number) {
    const url = this.baseUrl + '/v1/budget_delete';
    const param = {
      child: child
    }
    return this.httpClient.post<IBudget[]>(url, param);
  }

}
