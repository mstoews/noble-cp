import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { IGridSettingsModel } from './grid.settings.service';
import { ISettings } from 'app/models';
import { shareReplay } from 'rxjs';

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
  read() {
    var url = this.baseUrl + '/v1/read_all_settings';
    return this.httpClient.get<ISettings[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  read_by_id() {
    var url = this.baseUrl + '/v1/read_setting_by_id';
    return this.httpClient.get<ISettings[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  delete(setting: ISettings) {
    var url = this.baseUrl + '/v1/delete_setting';
    return this.httpClient.post<ISettings[]>(url, setting).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  update(setting: ISettings) {
    var url = this.baseUrl + '/v1/update_setting';
    return this.httpClient.post<ISettings[]>(url, setting).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }
}


