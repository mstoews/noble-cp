import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subject, retry, shareReplay, throttleTime } from 'rxjs';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ITrialBalance } from 'app/models';
import { ITBParams, ITBStartEndDate } from 'app/models/journals';
import { IDataSet } from '@syncfusion/ej2-angular-pivotview';
import { throttle } from 'lodash';



@Injectable({
  providedIn: 'root'
})
export class ReportService implements OnDestroy {

  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  private baseUrl = environment.baseUrl;
  ngDestroy$ = new Subject();

  readTBByStartAndEndDate(value: ITBStartEndDate) {
    var url = this.baseUrl + '/v1/read_tb_by_start_end_date';
    return this.httpClient.post<ITrialBalance[]>(url, value).pipe(
      throttleTime(2000),
      shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }
  readTbByPeriod(value: ITBParams) {
    var url = this.baseUrl + '/v1/read_tb_by_period';
    return this.httpClient.post<ITrialBalance[]>(url, value).pipe(
      throttleTime(2000),
      shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  readTbByStartDate(value: ITBParams) {
    var url = this.baseUrl + '/v1/read_tb_by_period';
    return this.httpClient.post<ITrialBalance[]>(url, value).pipe(
      throttleTime(2000),
      shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  readPivotDataByPeriod(value: ITBParams) {
    var url = this.baseUrl + '/v1/read_tb_by_period';
    return this.httpClient.post<ITrialBalance[]>(url, value).pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next(null);
    this.ngDestroy$.complete();
  }

}