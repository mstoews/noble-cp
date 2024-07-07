import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';

export interface IPeriod {
  period_id : number,
  period_year: number,
  start_date: Date, 
  end_date:  Date,
  description: string,
  create_date: Date,
  create_user: string,
  update_date: Date,
  update_user: string
}


@Injectable({
  providedIn: 'root'
})
export class PeriodsService {

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;
  
  constructor() { }

   createEvidence(period: IPeriod) { 
    var url = this.baseUrl + '/v1/period_create';

    var data: IPeriod = {
      period_id : period.period_id,
      period_year: period.period_year,
      start_date:  period.start_date, 
      end_date:    period.end_date,
      description: period.description,
      create_date: period.create_date,
      create_user: period.create_user,
      update_date: period.update_date,
      update_user: period.update_user,
    }

    return this.httpClient.post<IPeriod>(url,data).pipe(
        shareReplay()) 
      }

    delete(period_id: number){
      const update = {
        period: period_id
      }
      var url = this.baseUrl + '/v1/periods_delete';
      return this.httpClient.post<IPeriod[]>(url, update).pipe(shareReplay()) 
    }

    create(period: IPeriod) {
      var url = this.baseUrl + '/v1/periods_create';
      return this.httpClient.post<IPeriod>(url, period).pipe(shareReplay()) 
    }
  
    update(period: IPeriod){
      var url = this.baseUrl + '/v1/periods_update';
      return this.httpClient.post<IPeriod[]>(url, period).pipe(shareReplay()) 
    }

    read() {
      var url = this.baseUrl + '/v1/periods_list';
      return this.httpClient.get<IPeriod[]>(url).pipe(shareReplay()) 
    }

}
