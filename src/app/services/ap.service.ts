import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, map, filter, TimeoutError, catchError, debounce, debounceTime, distinctUntilChanged, interval, shareReplay, throwError, timer } from 'rxjs';
import { environment } from 'environments/environment';
import { ToastrService } from "ngx-toastr";
import { ICurrentPeriod, ICurrentPeriodParam, IPeriod } from 'app/models/period';
import { IAccounts } from 'app/models';
import { IPeriodParam } from 'app/models/period';
import { IAPTransaction, IInvoice } from 'app/models/ap';



@Injectable({
  providedIn: 'root'
})
export class APService implements OnDestroy {

  httpClient = inject(HttpClient)
  toastr = inject(ToastrService);
  private baseUrl = environment.baseUrl;
  
  createAPTransaction(params: IAPTransaction) {
    var url = this.baseUrl + '/v1/create_ap_transaction';    
    return this.httpClient.post<IAPTransaction>(url, params).pipe(
      catchError(err => {
        if (err.status === 200) {
          this.showAlert(JSON.stringify(err.message), 'pass');
        } else {
          const message = err.error;
          this.showAlert(JSON.stringify(message), 'failed');
          return throwError(() => new Error(`${JSON.stringify(err)}`));
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  showAlert(message: string, response: string) {
    if (response == "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
  }
  ngOnDestroy(): void { }

}

