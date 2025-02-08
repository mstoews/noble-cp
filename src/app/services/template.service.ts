import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';

import {
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
        return this.httpClient.post<IJournalTemplate>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    read() {
        var url = this.baseUrl + '/v1/read_journal_template';
        return this.httpClient.get<IJournalTemplate[]>(url);
    }

    delete(template_id: string) {
        const update = {
            template_id: template_id,
        }
        var url = this.baseUrl + '/v1/delete_template';
        return this.httpClient.post<IJournalDetailTemplate>(url, update).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    update(template: IJournalTemplate) {
        var url = this.baseUrl + '/v1/update_template';
        return this.httpClient.post<IJournalTemplate[]>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    create_details(template: IJournalDetailTemplate) {
        var url = this.baseUrl + '/v1/create_template';
        return this.httpClient.post<IJournalTemplate>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    readTemplateDetails(template: string) {
        var url = this.baseUrl + '/v1/read_template_details/' + template;
        return this.httpClient.get<IJournalDetailTemplate[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    update_details(template: IJournalDetailTemplate) {
        var url = this.baseUrl + '/v1/update_details_template';
        return this.httpClient.post<IJournalTemplate[]>(url, template).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }

    delete_detail(template_id: string) {
        const update = {
            template_id: template_id,
            detail_id: template_id
        }
        var url = this.baseUrl + '/v1/delete_detail_template';
        return this.httpClient.post<IJournalDetailTemplate>(url, update).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }
}
