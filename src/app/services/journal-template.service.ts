import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IType } from 'app/models';
import { IAccounts, IJournalTemplate } from 'app/models/journals';
import { IParty } from 'app/models/party';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalTemplateService {

  httpClient = inject(HttpClient)

  private baseUrl = environment.baseUrl;
  
  readTemplate() {
    var url = this.baseUrl + '/v1/read_journal_template';
    return this.httpClient.get<IJournalTemplate>(url).pipe(shareReplay());
  }

  readTemplates() {
    var url = this.baseUrl + '/v1/read_journal_template';
    return this.httpClient.get<IJournalTemplate[]>(url).pipe(shareReplay());
  }

  readAccounts() {
    var url = this.baseUrl + '/v1/account_list';
    return this.httpClient.get<IAccounts[]>(url).pipe(shareReplay());
  }

  readAccountType() {
    var url = this.baseUrl + '/v1/account_type';
    return this.httpClient.get<IType[]>(url).pipe(shareReplay());
  }

  readParty() {
    var url = this.baseUrl + '/v1/party_list';
    return this.httpClient.get<IParty[]>(url).pipe(shareReplay());
  }

    
}
