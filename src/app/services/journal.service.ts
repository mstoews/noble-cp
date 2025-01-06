import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, debounceTime, distinctUntilChanged, retry, shareReplay, take, takeUntil, tap, throwError, timeout, timer } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { ToastrService } from "ngx-toastr";
import { IPeriod } from 'app/models/period';

import {
  IAccounts,
  IArtifacts,
  IJournalDetail,
  IJournalDetailDelete,
  IJournalDetailTemplate,
  IJournalHeader,
  IJournalHeaderUpdate,
  IJournalTemplate,
  IReadJournalDetailsParams,
  ITransactionDate
} from 'app/models/journals';

import { IJournalParams } from 'app/models';
import { IPeriodParam } from 'app/models/period';


@Injectable({
  providedIn: 'root'
})
export class JournalService implements OnDestroy {

  httpClient = inject(HttpClient)
  toastr = inject(ToastrService);
  private baseUrl = environment.baseUrl;
  
  readJournalTemplate() {
    var url = this.baseUrl + '/v1/read_journal_template';
    return this.httpClient.get<IJournalTemplate[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for templates ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }

  createJournalTemplate(params: IJournalParams) {
    var url = this.baseUrl + '/v1/create_journal_template';
    return this.httpClient.post<IJournalTemplate>(url, params).pipe(
      catchError(err => {
        const message = "Failed to connect to server for templates ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }


  readHttpLoadArtifactsByJournalId(journal_id: number) {
    var url = this.baseUrl + '/v1/read_artifacts_by_jrn_id/' + journal_id;
    return this.httpClient.get<IArtifacts[]>(url).pipe(debounceTime(1000), distinctUntilChanged()).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journals ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),shareReplay());
  }

  updateHttpArtifacts(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/update_evidence';
    return this.httpClient.post(url, evidence).pipe(
      catchError(err => {
        const message = "Failed to connect to server for artifacts ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }


  readHttpAccounts() {
    var url = this.baseUrl + '/v1/account_list';
    return this.httpClient.get<IAccounts[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for accounts ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }

  getLastJournalNo(): Observable<number | Object> {
    var url = this.baseUrl + '/v1/read_last_journal_no';
    return this.httpClient.get(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journals ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay()
    );
  }

  readPeriodFromTransactionDate(transaction_date: ITransactionDate): any {
    var url = this.baseUrl + '/v1/read_period_from_transaction';
    this.httpClient.post<IPeriod>(url, transaction_date).pipe(
      catchError(err => {
        const message = "Failed to connect to server for periods ...";        
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }

  getJournalHeaderById(journal_id: number) {
    var url = this.baseUrl + '/v1/read_journal_header_by_id';
    return this.httpClient.post<IJournalHeader>(url,
      {
        journal_id: journal_id,
        status: "CLOSED"
      },
    ).pipe(
      catchError(err => {
        const message = "Failed to connect to server journal header ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay())
  }

  reNumberJournalDetail(journal_id: number) {
    var url = this.baseUrl + '/v1/renumber_journal_details';
    const update = {
      journal_id: journal_id
    }
    return this.httpClient.post<IJournalDetail[]>(url, update).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journal details ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }

  getHttpTemplateDetails(journal_id: number) {
    console.log('getHttpJournalDetails', journal_id);
    var url = this.baseUrl + '/v1/get_journal_detail/' + journal_id;
    return this.httpClient.get<IJournalDetail[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for template details ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }

  getHttpJournalDetails(journal_id: number) {
    console.log('getHttpJournalDetails', journal_id);
    var url = this.baseUrl + '/v1/get_journal_detail/' + journal_id;
    return this.httpClient.get<IJournalDetail[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journal details ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());;
  }

  getJournalHeaderByPeriod(period: IPeriodParam) {
    var url = this.baseUrl + '/v1/read_journal_header_by_period';
    return this.httpClient.post<IJournalHeader[]>(url, period).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journal header ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  } 

  getHttpAllJournalDetailsByPeriod(period: IPeriodParam) {
    var url = this.baseUrl + '/v1/get_journal_detailbyperiod/';
    return this.httpClient.post<IJournalDetail[]>(url, period).pipe(
      catchError(err => {
        const message = "Failed to connect to server for periods ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }
  
  readHttpJournalHeader() {
    var url = this.baseUrl + '/v1/read_journal_header';
    return this.httpClient.get<IJournalHeader[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journal header ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }

  // read_tb_by_period

  
  getJournalAccountsByPeriod(period: number, periodYear: number, child: number) {
    var url = this.baseUrl + '/v1/read_journal_by_account';
    return this.httpClient.post(url, {
      period: period,
      period_year: periodYear,
      child: child
    }).pipe(
      catchError(err => {
        const message = "Failed to connect to server for accounts ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());;
  }

  readJournalDetails(period: number, periodYear: number, child: number) {
    var url = this.baseUrl + '/v1/read_journal_by_account';
    return this.httpClient.post(url, {
      period: period,
      period_year: periodYear,
      child: child
    }).pipe(shareReplay());
  }

  readJournalsByAccount(  params : IReadJournalDetailsParams) {
    var url = this.baseUrl + "/v1/read_transaction_by_account";
    return this.httpClient.post(url, { params }).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journals ...";
        this.ShowAlert(message, 'failed');                
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay()) as Observable<IJournalDetail[]>;
  }

  read_transaction_by_account(child: string) {
    var url = this.baseUrl + '/v1/get_jd_by_child/' + child;
    return this.httpClient.post<IJournalDetail[]>(url, {
      child: child
    }).pipe(
      shareReplay());
  }

  getJournalDetailByPeriod(period: number, period_year: number) {
    var url = this.baseUrl + '/v1/read_journal_header_by_id/';
    return this.httpClient.post<IJournalDetail[]>(url, {
      period: period,
      period_year: period_year
    }).pipe(
      shareReplay());
  }

  listAccounts() {
    var url = this.baseUrl + '/v1/account_list';
    return this.httpClient.get<IAccounts[]>(url).pipe(
      shareReplay())
  }

  listJournalDetail() {
    let url = this.baseUrl + '/v1/read_journal_detail';
    return this.httpClient.get<IJournalDetail[]>(url).pipe(
      shareReplay())
  }

  updateJournalHeader(header: IJournalHeaderUpdate) {
    let url = this.baseUrl + '/v1/update_journal_header';
    let journalHeaderUpdate: IJournalHeaderUpdate = {
       journal_id: header.journal_id,
       description: header.description,
       transaction_date: header.transaction_date,
       amount: Number(header.amount),
       template_name: header.template_name,
       party_id: header.party_id,
       invoice_no: header.invoice_no,
       type: header.type
     }
     return this.httpClient.post<any>(url, journalHeaderUpdate).pipe(
        shareReplay()
      );
  }
  
  deleteJournalHeader(journal_id: number) {
    let url = this.baseUrl + '/v1/delete_journal_header';
    return this.httpClient.post<IJournalHeader>(url, { journal_id: journal_id },).pipe(shareReplay());
  }


  createJournalHeader(header: IJournalHeader) {
    let url = this.baseUrl + '/v1/create_journal_header';
    let journalHeader: any = {
      description: header.description,
      transaction_date: header.transaction_date,
      amount: header.amount,
      type: header.type,
      template_name: header.template_name,
      party_id: header.party_id
    }
    return this.httpClient.post<IJournalHeader>(url, journalHeader).pipe(shareReplay())
  }

  createHttpJournalDetail(detail: IJournalDetail) {
    let url = this.baseUrl + '/v1/create_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail);
  }


  updateJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/update_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail).pipe(shareReplay());
  }


  updateHttpJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/update_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail);
  }

  deleteHttpJournalDetail(journal: IJournalDetailDelete) {
    var url = this.baseUrl + '/v1/delete_journal_details';
    return this.httpClient.post<IJournalDetailDelete>(url, journal);
  }


  getTemplateDetails(reference: string): Observable<IJournalDetailTemplate[]> {
    var url = this.baseUrl + "/v1/read_template_details/" + reference;
    return this.httpClient.get<IJournalDetailTemplate[]>(url);
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

  getSettings(value : string) {
    var url = this.baseUrl + '/v1/read_settings_value_by_id/' + value;
    return this.httpClient.get<string>(url).pipe(shareReplay());
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

  ShowAlert(message: string, response: string) {
    if (response == "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }    
  }

  ngOnDestroy(): void { }

}

