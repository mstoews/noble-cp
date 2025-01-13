import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IPeriod } from 'app/models/period';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PeriodsService {

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;

  constructor() { }

  delete(period_id: number) {
    const update = {
      period: period_id
    }
    var url = this.baseUrl + '/v1/periods_delete';
    return this.httpClient.post<IPeriod[]>(url, update).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  create(period: IPeriod) {
    var url = this.baseUrl + '/v1/periods_create';
    return this.httpClient.post<IPeriod>(url, period).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  update(period: IPeriod) {
    var url = this.baseUrl + '/v1/periods_update';
    return this.httpClient.post<IPeriod[]>(url, period).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  read() {
    var url = this.baseUrl + '/v1/periods_list';
    return this.httpClient.get<IPeriod[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

}
