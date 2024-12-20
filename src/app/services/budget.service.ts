import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { Timestamp } from 'firebase/firestore';
import { AUTH } from 'app/app.config';
import { IAccounts } from 'app/models/journals';
import { IBudget } from 'app/models';
import { shareReplay } from 'rxjs';

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

    return this.httpClient.post<IBudget>(url, budget).pipe(shareReplay());
  }

  // Read
  read() {
    var url = this.baseUrl + '/v1/read_budget_amt';
    return this.httpClient.get<IBudget[]>(url).pipe(shareReplay());
  }

  // Update
  update(t: IBudget) {
    var url = this.baseUrl + '/v1/update_budget_amt';
    return this.httpClient.post<IBudget>(url, t).pipe(shareReplay());
  }

  // Delete
  delete(child: number) {
    const url = this.baseUrl + '/v1/budget_delete';
    const param = {
      child: child
    }
    return this.httpClient.post<IBudget[]>(url, param).pipe(shareReplay());;
  }

}
