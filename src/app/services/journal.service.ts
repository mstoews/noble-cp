import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, debounce, debounceTime, distinctUntilChanged, interval, retry, shareReplay, take, takeUntil, tap, throwError, timeout, timer } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { ToastrService } from "ngx-toastr";
import { IPeriod } from 'app/models/period';
import { IAccounts } from 'app/models';
import { IJournalParams } from 'app/models';
import { IPeriodParam } from 'app/models/period';

import {
  IArtifacts,
  IJournalTransactions,
  IJournalDetail,
  IJournalDetailDelete,
  IJournalDetailTemplate,
  IJournalDetailUpdate,
  IJournalHeader,
  IJournalTemplate,
  IReadJournalDetailsParams,
  ITemplateParams,
  ITransactionDate
} from 'app/models/journals';



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
        const message = "Failed to read journals templates ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  updateCurrentPeriod(period: IPeriodParam) {
    var url = this.baseUrl + '/v1/update_current_period';
    return this.httpClient.post<IPeriodParam>(url, period).pipe(
      catchError(err => {const message = "Failed to read journals templates ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }))
  }
  createJournalTemplate(params: ITemplateParams) {
    var url = this.baseUrl + '/v1/create_journal_template';
    return this.httpClient.post<IJournalTemplate>(url, params).pipe(
      catchError(err => {
        const message = "Failed to connect to server for templates ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  updateFirebaseTrialBalance(period: IPeriodParam) {
    var url = this.baseUrl + '/v1/update_firebase_trial_balance';
    return this.httpClient.post(url, period).pipe(
      catchError(err => {
        const message = "Failed to complete - firebase trial balance  ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  // Journal Params Arrays

  createJournal(params: IJournalTransactions) {
    var url = this.baseUrl + '/v1/create_journal';
    return this.httpClient.post<IJournalTransactions>(url, params).pipe(
      catchError(err => {
        if (err.status === 200) {
          this.ShowAlert(JSON.stringify(err.message), 'pass');
        } else {
          const message = err.error;
          this.ShowAlert(JSON.stringify(message), 'failed');
          return throwError(() => new Error(`${JSON.stringify(err)}`));
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  
  readJournalTransactions(params: IPeriodParam): Observable<IJournalTransactions[]> {
    var url = this.baseUrl + '/v1/read_journals_by_period';
    return this.httpClient.post<IJournalTransactions[]>(url, params).pipe(
      catchError(err => {
        this.ShowAlert("Failed to read journal entry ...", 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }


  readHttpLoadArtifactsByJournalId(journal_id: number) {
    var url = this.baseUrl + '/v1/read_artifacts_by_jrn_id/' + journal_id;
    return this.httpClient.get<IArtifacts[]>(url).pipe(debounceTime(1000), distinctUntilChanged()).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journals ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }), shareReplay({ bufferSize: 1, refCount: true }));
  }

  updateHttpArtifacts(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/update_evidence';
    return this.httpClient.post(url, evidence).pipe(
      catchError(err => {
        const message = "Failed to connect to server for artifacts ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  readHttpAccounts() {
    var url = this.baseUrl + '/v1/account_list';
    return this.httpClient.get<IAccounts[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for accounts ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }
  
  getLastJournalNo(): Observable<number> {
    var url = this.baseUrl + '/v1/read_last_journal_no';
    return this.httpClient.get<number>(url).pipe(
      debounce(() => interval(2000)),
      catchError(err => {
        const message = "Failed to connect to server for journals ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  readPeriodFromTransactionDate(transaction_date: ITransactionDate): any {
    var url = this.baseUrl + '/v1/read_period_from_transaction';
    this.httpClient.post<IPeriod>(url, transaction_date).pipe(
      catchError(err => {
        const message = "Failed to connect to server for periods ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
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
      shareReplay(1))
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
      shareReplay({ bufferSize: 1, refCount: true }));
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
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  getHttpJournalDetails(journal_id: number) {    
    var url = this.baseUrl + '/v1/get_journal_detail/' + journal_id;
    return this.httpClient.get<IJournalDetail[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journal details ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));;
  }

  getJournalHeaderByPeriod(period: IPeriodParam) {
    var url = this.baseUrl + '/v1/read_journal_header_by_period';
    return this.httpClient.post<IJournalHeader[]>(url, period).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journal header ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  getHttpAllJournalDetailsByPeriod(period: IPeriodParam) {
    var url = this.baseUrl + '/v1/get_journal_detailbyperiod/';
    return this.httpClient.post<IJournalDetail[]>(url, period).pipe(
      catchError(err => {
        const message = "Failed to connect to server for periods ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  readHttpJournalHeader() {
    var url = this.baseUrl + '/v1/read_journal_header';
    return this.httpClient.get<IJournalHeader[]>(url).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journal header ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true }));
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
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  readJournalDetails(period: number, periodYear: number, child: number) {
    var url = this.baseUrl + '/v1/read_journal_by_account';
    return this.httpClient.post(url, {
      period: period,
      period_year: periodYear,
      child: child
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  readJournalsByAccount(params: IReadJournalDetailsParams) {
    var url = this.baseUrl + "/v1/read_transaction_by_account";
    return this.httpClient.post(url, { params }).pipe(
      catchError(err => {
        const message = "Failed to connect to server for journals ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay({ bufferSize: 1, refCount: true })) as Observable<IJournalDetail[]>;
  }

  read_transaction_by_account(child: string) {
    var url = this.baseUrl + '/v1/get_jd_by_child/' + child;
    return this.httpClient.post<IJournalDetail[]>(url, {
      child: child
    }).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  getJournalDetailByPeriod(period: number, period_year: number) {
    var url = this.baseUrl + '/v1/read_journal_header_by_id/';
    return this.httpClient.post<IJournalDetail[]>(url, {
      period: period,
      period_year: period_year
    }).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  listAccounts() {
    var url = this.baseUrl + '/v1/account_list';
    return this.httpClient.get<IAccounts[]>(url).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  listJournalDetail() {
    let url = this.baseUrl + '/v1/read_journal_detail';
    return this.httpClient.get<IJournalDetail[]>(url).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  updateJournalHeader(header: IJournalHeader) {
    let url = this.baseUrl + '/v1/update_journal_header';
    let journalHeaderUpdate: IJournalHeader = {
      journal_id: header.journal_id,
      booked_user: header.booked_user,
      booked: header.booked,
      type: header.type,
      period: header.period,
      period_year: header.period_year,
      description: header.description,
      transaction_date: header.transaction_date,
      amount: Number(header.amount),
      template_name: header.template_name,
      party_id: header.party_id,
      invoice_no: header.invoice_no,
    }
    return this.httpClient.post<IJournalHeader>(url, journalHeaderUpdate).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  deleteJournalHeader(journal_id: number) {
    let url = this.baseUrl + '/v1/delete_journal_header';
    return this.httpClient.post<IJournalHeader>(url, { journal_id: journal_id },).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }


  updateDistributionLedger(prd: IPeriodParam) {
    let url = this.baseUrl + '/v1/update_distribution_ledger';
    const periodYear = {
      period: prd.period,
      year: prd.period_year
    }
    return this.httpClient.post<string>(url, { periodYear },).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }


  createJournalFullHeader(header: IJournalHeader) {
    let url = this.baseUrl + '/v1/create_full_journal_header';
    let journalHeader: IJournalHeader = {
      "journal_id": header.journal_id,
      "description": header.description,
      "booked": header.booked,
      "booked_user": header.booked_user,
      "period": header.period,
      "period_year": header.period_year,
      "type": header.type,
      "amount": header.amount,
      "transaction_date": header.transaction_date,
      "party_id": header.party_id,
      "template_name": header.template_name,
      "invoice_no": header.invoice_no,
      "status": "CLOSED",
    }
    return this.httpClient.post<IJournalHeader>(url, journalHeader).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }


  createHttpJournalDetail(detail: IJournalDetail) {
    let url = this.baseUrl + '/v1/create_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  cloneJournalById(journal_id: number) {
    let url = this.baseUrl + '/v1/clone_journal_entry';
    return this.httpClient.post<IJournalHeader>(url, { journal_id: journal_id }).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }

  createTemplateById(journalTemplate: ITemplateParams) {
    let url = this.baseUrl + '/v1/create_journal';
    return this.httpClient.post<IJournalHeader>(url, journalTemplate).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
  }


  updateJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/update_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail).pipe(shareReplay(1));
  }


  deleteHttpJournalDetail(journal: IJournalDetailDelete) {
    var url = this.baseUrl + '/v1/delete_journal_details';
    return this.httpClient.post<IJournalDetailDelete>(url, journal).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));;;
  }


  getTemplateDetails(reference: string): Observable<IJournalDetailTemplate[]> {
    var url = this.baseUrl + "/v1/read_template_details/" + reference;
    return this.httpClient.get<IJournalDetailTemplate[]>(url).pipe(
      shareReplay({ bufferSize: 1, refCount: true }));
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

  getSettings(value: string) {
    var url = this.baseUrl + '/v1/read_settings_value_by_id/' + value;
    return this.httpClient.get<string>(url).pipe(shareReplay(1));
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

