import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, retry, shareReplay, take, takeUntil, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  IAccounts,
  IArtifacts,
  IJournalDetail,
  IJournalDetailDelete,
  IJournalHeader,
  IJournalHeaderUpdate,
  IJournalTemplate,
  IPeriod,
  IPeriodParam,
  ITransactionDate
} from 'app/models/journals';



@Injectable({
  providedIn: 'root'
})
export class JournalService implements OnDestroy {

  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  private baseUrl = environment.baseUrl;
  ngDestroy$ = new Subject();

  readJournalTemplate() {
    var url = this.baseUrl + '/v1/read_journal_template';
    return this.httpClient.get<IJournalTemplate>(url).pipe(shareReplay());
  }

  readHttpLoadArtifactsByJournalId(journal_id: number) {
    var url = this.baseUrl + '/v1/read_artifacts_by_jrn_id/' + journal_id;
    return this.httpClient.get<IArtifacts[]>(url).pipe(shareReplay());
  }

  updateHttpArtifacts(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/update_evidence';
    return this.httpClient.post(url, evidence).pipe(shareReplay());
  }


  readHttpAccounts() {
    var url = this.baseUrl + '/v1/account_list';
    return this.httpClient.get<IAccounts[]>(url).pipe(shareReplay());
  }

  getLastJournalNo(): Observable<number | Object> {
    var url = this.baseUrl + '/v1/read_last_journal_no';
    return this.httpClient.get(url).pipe(
      catchError(err => {
        const message = "Could not retrieve id ...";
        console.debug(message, err);
        this.message(message);
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay()
    );
  }

  readPeriodFromTransactionDate(transaction_date: ITransactionDate): any {
    var url = this.baseUrl + '/v1/read_period_from_transaction';
    this.httpClient.post<IPeriod>(url, transaction_date).pipe(
      catchError(err => {
        const message = "Could not retrieve id ...";
        console.debug(message, err);
        this.message(message);
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }),
      shareReplay());
  }

  getJournalHeaderById(journal_id: number) {
    var url = this.baseUrl + '/v1/read_journal_header_by_id';
    return this.httpClient.post<IJournalHeader>(url,
      {
        journal_id: journal_id,
        status: "open"
      },
    ).pipe(shareReplay())
  }

  reNumberJournalDetail(journal_id: number) {
    var url = this.baseUrl + '/v1/renumber_journal_details';
    const update = {
      journal_id: journal_id
    }
    return this.httpClient.post<IJournalDetail[]>(url, update).pipe(shareReplay());
  }

  getHttpJournalDetails(journal_id: number) {
    var url = this.baseUrl + '/v1/get_journal_detail/' + journal_id;
    return this.httpClient.get<IJournalDetail[]>(url);
  }

  getHttpAllJournalDetailsByPeriod(period: IPeriodParam) {
    var url = this.baseUrl + '/v1/get_journal_detail/';
    return this.httpClient.post<IJournalDetail[]>(url, period);
  }
  
  readHttpJournalHeader() {
    var url = this.baseUrl + '/v1/read_journal_header';
    return this.httpClient.get<IJournalHeader[]>(url).pipe(shareReplay(), retry(2));
  }

  getJournalAccountsByPeriod(period: number, periodYear: number, child: number) {
    var url = this.baseUrl + '/v1/read_journal_by_account';
    return this.httpClient.post(url, {
      period: period,
      period_year: periodYear,
      child: child
    });
  }

  readJournalDetails(period: number, periodYear: number, child: number) {
    var url = this.baseUrl + '/v1/read_journal_by_account';
    return this.httpClient.post(url, {
      period: period,
      period_year: periodYear,
      child: child
    }).pipe(shareReplay());
  }


  getJournalDetailByChildAccount(child: string) {
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
    var url = this.baseUrl + '/v1/read_journal_detail';
    return this.httpClient.get<IJournalDetail[]>(url).pipe(
      shareReplay())
  }

  updateJournalHeader(header: IJournalHeaderUpdate) {
    var url = this.baseUrl + '/v1/update_journal_header';

     var journalHeaderUpdate: IJournalHeaderUpdate = {
       journal_id: header.journal_id,
       description: header.description,
       transaction_date: header.transaction_date,
       amount: Number(header.amount)
     }
     return this.httpClient.post<any>(url, journalHeaderUpdate).pipe(
        shareReplay()
      );
  }
  
  deleteJournalHeader(journal_id: number) {
    var url = this.baseUrl + '/v1/delete_journal_header';
    return this.httpClient.post<IJournalHeader>(url, { journal_id: journal_id },).pipe(shareReplay());
  }


  createJournalHeader(header: IJournalHeader) {
    var url = this.baseUrl + '/v1/create_journal_header';
    var journalHeader: any = {
      description: header.description,
      transaction_date: header.transaction_date,
      amount: header.amount
    }
    return this.httpClient.post<IJournalHeader>(url, journalHeader).pipe(shareReplay())
  }

  updateJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/update_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail);
  }


  updateHttpJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/update_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail);
  }


  message(msg: string) {
    this.snackBar.open(msg, 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-white',
      duration: 2000,
    });
  }

  deleteHttpJournalDetail(journal: IJournalDetailDelete) {
    var url = this.baseUrl + '/v1/delete_journal_details';
    return this.httpClient.post<IJournalDetailDelete>(url, journal);
  }

  createHttpJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/create_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail);
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

}

