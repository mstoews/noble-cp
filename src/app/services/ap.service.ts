import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { IAPTransaction } from 'app/models/ap';
import { ICurrentPeriodParam} from 'app/models/period';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APService  {

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;
  readAPTransaction() {
    var url = this.baseUrl + '/v1/read_ap_transaction';    
    return this.httpClient.get<IAPTransaction[]>(url).pipe(shareReplay());    
  }
  deleteAPTransaction(params: IAPTransaction) {
    var url = this.baseUrl + '/v1/delete_ap_transaction';    
    return this.httpClient.post<IAPTransaction[]>(url, params).pipe(shareReplay());    
  }
  updateAPTransaction(params: IAPTransaction) {
    var url = this.baseUrl + '/v1/update_ap_transaction';    
    return this.httpClient.post<IAPTransaction[]>(url, params).pipe(shareReplay());    
  }
  readAPTransactionByPeriod(params: ICurrentPeriodParam) {
    var url = this.baseUrl + '/v1/read_ap_transaction_by_current_period';    
    return this.httpClient.post<IAPTransaction[]>(url, params).pipe(shareReplay());    
  }
  createAPTransaction(params: IAPTransaction) {
    var url = this.baseUrl + '/v1/create_ap_transaction';    
    return this.httpClient.post<IAPTransaction[]>(url, params).pipe(shareReplay());    
  }
  
}

