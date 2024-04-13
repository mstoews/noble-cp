import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { filter, shareReplay } from 'rxjs';

import { environment } from 'environments/environment.prod';

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
  account       : string,
  child         : string,
  fund?         : string,
  sub_type?      : string,
  description   : string,
  debit         : number,
  credit        : number,
  create_date   : string,
  create_user   : string
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
  update_user   : string
}


export interface IJournalViewDetails {
    period          : number,
    period_year     : number,
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
    fund            : string
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;
  constructor() { }

  // Header
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
      shareReplay())
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
      journal_id: 0,
      description: '',
      booked: false,
      booked_date: '',
      booked_user: '',
      create_date: '',
      create_user: '',
      period: 0,
      period_year: 0,
      transaction_date: '',
      status: '',
      type: '',
      amount: 0
    }

    return this.httpClient.post<IJournalHeader>(url,
      {
        journal: journalHeader
      },
      ).pipe(
      shareReplay())
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

    return this.httpClient.post<IJournalHeader>(url,
      {
        journal: journalHeader
      },
      ).pipe(
      shareReplay())
  }


  updateJournalDetail(detail: IJournalDetail){ }

  deleteJournalDetail(journal_id: number){ }

  createJournalDetail(detail: IJournalDetail) {}

  // Book Journals
  // Summary Journal Outstanding
  // Create TrialBalance
  // Roll Period

}

/*
create table public.gl_journal_detail
(
    journal_id    integer not null,
    journal_subid integer not null,
    account       integer,
    child         integer,
    sub_type      varchar(30),
    description   varchar(100),
    debit         numeric(16, 2),
    credit        numeric(16, 2),
    create_date   date,
    create_user   varchar(20),
    constraint gl_journal_detail_pk
        primary key (journal_id, journal_subid)
);

alter table public.gl_journal_detail
    owner to mstoews;
*/
