import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, filter, shareReplay, throwError } from 'rxjs';

import { environment } from 'environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IJournalHeader {
    journal_id?: number,
    description?: string,
    booked?: boolean,
    booked_date?: string,
    booked_user?: string,
    create_date?: string,
    create_user?: string,
    period?: number,
    period_year?: number,
    transaction_date?: string,
    status?: string,
    type?: string,
    sub_type?: string,
    amount?: number
}

export interface IJournalDetail {
  journal_id    : number,
  journal_subid : number,
  account       : number,
  child         : number,
  fund?         : string,
  sub_type?     : string,
  description   : string,
  debit         : number,
  credit        : number,
  create_date   : string,
  create_user   : string,
  reference     :string,
}

export interface IAccounts {
  account       : number,
  child         : number,
  parent_account: string,
  type          : string,
  sub_type      : string,
  description   : string,
  balance       : number,
  comments      : string,
  create_date   : string,
  create_user   : string,
  update_date   : string,
  update_user   : string,
  period?       : number,
  period_year?  : number,
}


export interface IJournalViewDetails {
    period?         : number,
    period_year?    : number,
    journal_id      : number,
    journal_subid   : number,
    account         : number,
    child           : number,
    description     : string,
    sub_type        : string,
    debit           : number,
    credit          : number,
    create_date     : Date,
    create_user     : string,
    fund            : string,
    reference       : string,
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar);
  private baseUrl = environment.baseUrl;
  constructor() { }

  getJournalHeader(journal_id: number) {
    var url = this.baseUrl + '/v1/get_jh/'+ journal_id.toString();
    return this.httpClient.post<IJournalHeader>(url,
      {
        journal_id: journal_id
      },
      ).pipe(
      shareReplay())
  }

  getJournalDetail(journal_id: number) {
    var url = this.baseUrl + '/v1/get_jd/' + journal_id.toString();
    return this.httpClient.post<IJournalDetail[]>(url, {
       journal_id: journal_id
      }).pipe(
      shareReplay());
  }

  getJournalAccountsByPeriod(period:  number , periodYear: number)
    {
        var url = this.baseUrl + '/v2/get_jrn_by_acct';
        return this.httpClient.post(url, {
         period: period,
         period_year: periodYear
        }).pipe(shareReplay());
    }

  getJournalDetailByChildAccount(child: string){
    var url = this.baseUrl + '/v1/get_jd_by_child/' + child;
    return this.httpClient.post<IJournalDetail[]>(url, {
       child: child
      }).pipe(
      shareReplay());
  }

  getJournalDetailByPeriod(period: number, period_year: number){
    var url = this.baseUrl + '/v1/get_jd_by_period/';
    return this.httpClient.post<IJournalDetail[]>(url, {
       period: period,
       period_year: period_year
      }).pipe(
      shareReplay());
  }


  listJournalHeader() {
    var url = this.baseUrl + '/v1/list_jh';
    return this.httpClient.get<IJournalHeader[]>(url).pipe(
      catchError(err => {
          const message = "Could not retrieve journals ...";
          console.debug(message, err);
          this.message(message); 
          return throwError(() => new Error(`${ JSON.stringify(err) }`));         
      }),
      shareReplay()
    )
  }


  listAccounts() {
    var url = this.baseUrl + '/v1/list_accounts';
    return this.httpClient.get<IAccounts[]>(url).pipe(
      shareReplay())
  }



  listJournalDetail() {
    var url = this.baseUrl + '/v1/list_hd';
    return this.httpClient.get<IJournalDetail[]>(url).pipe(
      shareReplay())
  }

  updateJournalHeader(header: IJournalHeader) {
    var url = this.baseUrl + '/v1/update_jh';

    var journalHeader: IJournalHeader = {
      journal_id: header.journal_id,
      description: header.description,
      booked: false,
      booked_date: header.booked_date,
      booked_user: header.booked_user,
      create_date: header.create_date,
      create_user: header.create_user,
      period: header.period,
      period_year: header.period_year,
      transaction_date: header.transaction_date,
      status: header.status,
      type: header.type,
      amount: header.amount
    }
    return this.httpClient.post<IJournalHeader>(url, journalHeader).pipe(
      catchError(err => {
          const message = "Could not save journal header ...";
          console.debug(message, err);
          this.message(message); 
          return throwError(() => new Error(`Invalid time ${ err }`));         
      }),
      shareReplay()
    ).subscribe();
  }

  deleteJournalHeader(journal_id: number) {
    var url = this.baseUrl + '/v1/delete_jh' + journal_id.toString();
    return this.httpClient.post<IJournalHeader>(url,
      {
        journal_id: journal_id
      },
      ).pipe(
      shareReplay())
  }



  createJournalHeader(header: IJournalHeader) {
    var url = this.baseUrl + '/v1/create_jh';

    var journalHeader: IJournalHeader = {
      journal_id: 0,
      description: header.description,
      booked: false,
      booked_date: header.booked_date,
      booked_user: header.booked_user,
      create_date: header.create_date,
      create_user: header.create_user,
      period: header.period,
      period_year: header.period_year,
      transaction_date: header.transaction_date,
      status: header.status,
      type: header.type,
      amount: header.amount
    }

    return this.httpClient.post<IJournalHeader>(url, journalHeader).pipe(shareReplay())
  }


  updateJournalDetail(detail: IJournalDetail){ 
    var url = this.baseUrl + '/v1/update_jd';
    return this.httpClient.post<IJournalDetail>(url, detail)
    .pipe(
      catchError(err => {
          const message = "Could not save journal detail";
          console.debug(message, err);
          this.message(message); 
          return throwError(() => new Error(`Invalid time ${ err }`));         
      }),
      shareReplay()
    ).subscribe();

  }


  message(msg: string){
    this.snackBar.open(msg, 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-danger',
      duration: 2000,
    });
  }


  deleteJournalDetail(journal_id: number){ 
    var url = this.baseUrl + '/v1/create_jd';
    return this.httpClient.post<IJournalDetail>(url, journal_id).pipe(shareReplay())
  }


  createJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/create_jd';
    var journalDetail: IJournalDetail = {
      journal_id: journalDetail.journal_id,
      journal_subid: detail.journal_subid,
      account: detail.account,
      child: detail.child,
      description: detail.description,
      create_date: detail.create_date,
      create_user: detail.create_user,
      sub_type: detail.sub_type,
      debit: detail.debit,
      credit: detail.credit,
      reference: detail.reference,
      fund: detail.fund
    }

    return this.httpClient.post<IJournalDetail>(url, journalDetail).pipe(shareReplay())
  }
}

