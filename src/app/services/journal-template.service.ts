import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IType } from "app/models/types";
import { IJournalDetailTemplate, IJournalTemplate } from "app/models/journals";
import { IParty } from "app/models/party";
import { environment } from "environments/environment";
import { shareReplay } from "rxjs";
import { IAccounts } from "app/models";

@Injectable({
  providedIn: "root",
})
export class JournalTemplateService {
  httpClient = inject(HttpClient);

  private baseUrl = environment.baseUrl;

  read() {
    var url = this.baseUrl + "/v1/read_journal_template";
    return this.httpClient.get<IJournalTemplate[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getTemplateDetails(reference: string) {
    var url = this.baseUrl + "/v1/read_template_details:/" + reference;
    return this.httpClient.get<IJournalDetailTemplate[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  readAccounts() {
    var url = this.baseUrl + "/v1/account_list";
    return this.httpClient.get<IAccounts[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  readAccountType() {
    var url = this.baseUrl + "/v1/account_type";
    return this.httpClient.get<IType[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  readParty() {
    var url = this.baseUrl + "/v1/party_list";
    return this.httpClient.get<IParty[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }


}
