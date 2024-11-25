import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IType } from "app/models";
import {
  IAccounts,
  IJournalDetailTemplate,
  IJournalTemplate,
} from "app/models/journals";
import { IParty } from "app/models/party";
import { environment } from "environments/environment.prod";
import {
  catchError,
  Observable,
  retry,
  shareReplay,
  throwError,
  timeout,
  TimeoutError,
  timer,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JournalTemplateService {
  httpClient = inject(HttpClient);

  private baseUrl = environment.baseUrl;

  readTemplate() {
    var url = this.baseUrl + "/v1/read_journal_template";
    return this.httpClient.get<IJournalTemplate>(url).pipe(shareReplay());
  }

  getTemplateDetails(reference: string): Observable<IJournalDetailTemplate[]> {
    var url = this.baseUrl + "/v1/read_template_details:/" + reference;
    return this.httpClient.get<IJournalDetailTemplate[]>(url).pipe(
      timeout(2),
      retry({
        count: environment.apiRetryCount,
        delay: (err, attemptNum) => {
          console.error(
            `[JournalTemplateService] => Encountered an error while retrying request on attempt ${attemptNum}: `,
            err
          );
          return timer(1000 * attemptNum);
        },
      }),
      catchError(this.handleErrorWithTimeout)
    );
  }

  readTemplates() {
    var url = this.baseUrl + "/v1/read_journal_template";
    return this.httpClient.get<IJournalTemplate[]>(url).pipe(shareReplay());
  }

  readAccounts() {
    var url = this.baseUrl + "/v1/account_list";
    return this.httpClient.get<IAccounts[]>(url).pipe(shareReplay());
  }

  readAccountType() {
    var url = this.baseUrl + "/v1/account_type";
    return this.httpClient.get<IType[]>(url).pipe(shareReplay());
  }

  readParty() {
    var url = this.baseUrl + "/v1/party_list";
    return this.httpClient.get<IParty[]>(url).pipe(shareReplay());
  }

  private handleErrorWithTimeout(error: HttpErrorResponse | TimeoutError) {
    let errorMessage = "";
    if (error instanceof TimeoutError) {
      console.error("[ApiService] => Request timed out!", error);
      return throwError(() => {
        return errorMessage;
      });
    } else {
      return this.handleError(error);
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.status === 0) {
      // Get client-side error
      errorMessage = error.error;
      console.error(
        "[ApiService] => Client-side HTTP error occurred: ",
        errorMessage,
        error
      );
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
      console.error(
        "[ApiService] => Server-side HTTP error occurred: ",
        errorMessage,
        error
      );
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
