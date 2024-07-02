import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { Timestamp } from 'firebase/firestore';
import { AUTH } from 'app/app.config';
import { IAccounts, IBudget, IBudgetDetails, IFunds, IType } from '../../models';
import { ISubType } from 'app/services/subtype.service';

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

    return this.httpClient.post<IBudget>(url, data)
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

  readBudgetDetails() {
    var url = this.baseUrl + '/v1/read_budget_details';
    return this.httpClient.get<IBudgetDetails[]>(url)
  }

  // Update
  update(t: IBudget) {
    var url = this.baseUrl + '/v1/update_budget_amt';

    var data: IBudget = {
      child: t.child,
      sub_type: t.sub_type,
      parent_account: t.parent_account,
      type: t.type,
      balance: t.balance,
      account: t.account,
      comments: t.comments,
      description: t.description,
      create_date: t.create_date,
      create_user: t.create_user,
      update_date: t.update_date,
      update_user: t.update_user

    }
    return this.httpClient.post<IBudget>(url, data)
  }

  // Delete
  delete(account: number, child: number) {
    const url = this.baseUrl + '/v1/budget_delete';
    const param = {
      account: account,
      child: child
    }
    return this.httpClient.post<IBudget[]>(url, param);
  }

}
