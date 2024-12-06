import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';

import {
    IAccounts,
    IJournalDetailTemplate,
    IJournalTemplate,
} from "app/models/journals";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
 
    httpClient = inject(HttpClient)
    private baseUrl = environment.baseUrl;
  
    create(template: IJournalTemplate) {
      var url = this.baseUrl + '/v1/create_template';
      return this.httpClient.post<IJournalTemplate>(url, template).pipe(shareReplay())
    }

    create_details(template: IJournalDetailTemplate) {
        var url = this.baseUrl + '/v1/create_template';
        return this.httpClient.post<IJournalTemplate>(url, template).pipe(shareReplay())
    }


    read() {
      var url = this.baseUrl + '/v1/read_templates';
      return this.httpClient.get<IJournalTemplate[]>(url).pipe(shareReplay())
    }

    readDetail(template: IJournalDetailTemplate) {
        var url = this.baseUrl + '/v1/read_detail_templates';
        return this.httpClient.get<IJournalTemplate[]>(url).pipe(shareReplay())
    }

    update(template: IJournalTemplate){
      var url = this.baseUrl + '/v1/update_template';
      return this.httpClient.post<IJournalTemplate[]>(url, template).pipe(shareReplay())
    }

    update_details(template: IJournalDetailTemplate){
        var url = this.baseUrl + '/v1/update_template';
        return this.httpClient.post<IJournalTemplate[]>(url, template).pipe(shareReplay())
    }

    delete_detail(template_id: string){
        const update = {
            template_id: template_id,
            detail_id: template_id
        }
        var url = this.baseUrl + '/v1/delete_detail_template';
        return this.httpClient.post<IJournalDetailTemplate>(url, update).pipe(shareReplay())
    }

    delete(template_id: string){
        const update = {
            template_id: template_id,
        }
        var url = this.baseUrl + '/v1/delete_template';
        return this.httpClient.post<IJournalDetailTemplate>(url, update).pipe(shareReplay())
    }


}
