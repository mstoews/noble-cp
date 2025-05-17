import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { IGridSettingsModel } from './grid.settings.service';
import { ISettings } from 'app/models';
import { shareReplay } from 'rxjs';
import { IPeriodParam } from 'app/models/period';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;
  create(setting: ISettings) {
    var url = this.baseUrl + '/v1/create_setting';
    return this.httpClient.post<ISettings>(url, setting).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  update_current_period(period_description: string) {
    var url = this.baseUrl + '/v1/update_period_by_description';
    const period_param = {
      description: period_description
    }
    return this.httpClient.post<string>(url, period_param).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }
  read() {
    var url = this.baseUrl + '/v1/read_all_settings';
    return this.httpClient.get<ISettings[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  read_by_value(value: string) {
    var url = this.baseUrl + '/v1/read_settings_value_by_id/' + value;
    return this.httpClient.get<string>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  delete(setting: ISettings) {
    var url = this.baseUrl + '/v1/delete_setting';
    return this.httpClient.post<ISettings[]>(url, setting).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  update(setting: ISettings) {
    var url = this.baseUrl + '/v1/update_setting';
    return this.httpClient.post<ISettings[]>(url, setting).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  updateCurrentPeriod(prdParm: IPeriodParam) {
    const prd = {
      period: prdParm.period,
      year: prdParm.period_year
    }
    var url = this.baseUrl + '/v1/update_current_period';
    return this.httpClient.post<IPeriodParam>(url, prd).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

}


