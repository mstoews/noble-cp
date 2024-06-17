import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { Timestamp } from 'firebase/firestore';
import { AUTH } from 'app/app.config';
import { IBudget } from '../models';


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
    var name   = email.substring(0, email.lastIndexOf("@"));
    const dDate = Timestamp.fromDate(new Date());
    
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
      update_date: dDate,
      update_user: name,
    }

    return this.httpClient.post<IBudget>(url, data)
  }
  
  // Read
  read() {
    var url = this.baseUrl + '/v1/read_budget_amt';
    return this.httpClient.get<IBudget[]>(url)
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
  delete(account: string, child: string) {
    const url = this.baseUrl + '/v1/budget_delete';
    const param = {
      account: account,
      child: child
    }
    return this.httpClient.post<IBudget[]>(url, param);
  }

}
