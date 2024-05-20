import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, Subscription, catchError, shareReplay, takeUntil, throwError } from 'rxjs';

import { environment } from 'environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IPeriod {
  period_id: number,
  period_year: number,
}

export interface IJournalDetailDelete {
  journal_id: number,
  journal_subid: number

}

export interface  IJournalHeaderUpdate {
  journal_id: number,
  description: string,
  transaction_date: string,
  amount: number
}

export interface IJournalHeader {
    journal_id: number,
    description: string,
    booked: boolean,
    booked_date: string,
    booked_user: string,
    create_date: string,
    create_user: string,
    period: number,
    period_year: number,
    transaction_date: string,
    status: string,
    type: string,
    sub_type: string,
    amount: number
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

export interface ITransactionDate {
  start_date: string,
  end_date: string
}


export interface IJournalTemplate {
    template_ref: string,    
    description: string,
    type: string,
    debit_percentage:  number,
    credit_percentage: number,
    create_date:       Date,
    create_user:       string
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
export class JournalService implements OnDestroy  {
  
  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar);
  private baseUrl = environment.baseUrl;
  ngDestroy$ = new Subject();

  readJournalTemplate() {
    var url = this.baseUrl + '/v1/read_journal_template';
    return this.httpClient.get<IJournalTemplate>(url).pipe(shareReplay());
  }

  getLastJournalNo(): Observable<number | Object> {
    var url = this.baseUrl + '/v1/read_last_journal_no';
    return this.httpClient.get(url).pipe(
      catchError(err => {
          const message = "Could not retrieve id ...";
          console.debug(message, err);
          this.message(message); 
          return throwError(() => new Error(`${ JSON.stringify(err) }`));         
      }),
      shareReplay()
    );
  }

  readPeriodFromTransactionDate(transaction_date: ITransactionDate): any  {
    var url = this.baseUrl + '/v1/read_period_from_transaction';
    this.httpClient.post<IPeriod>(url, transaction_date ).pipe(
      catchError(err => {
        const message = "Could not retrieve id ...";
        console.debug(message, err);
        this.message(message); 
        return throwError(() => new Error(`${ JSON.stringify(err) }`));         
    }),
      shareReplay());      
  }

  getJournalHeader(journal_id: number) {
    var url = this.baseUrl + '/v1/read_journal_header_by_id';
    return this.httpClient.post<IJournalHeader>(url,
      {
        journal_id: journal_id,
        status: "Open"
      },
      ).pipe(
      shareReplay())
  }

  getJournalDetail(journal_id: number) {
    var url = this.baseUrl + '/v1/get_journal_detail/' + journal_id.toString();
    return this.httpClient.post<IJournalDetail[]>(url, {
       journal_id: journal_id
      }).pipe(
      shareReplay());
  }

  getJournalAccountsByPeriod(period:  number , periodYear: number) {
        var url = this.baseUrl + '/v1/get_jrn_by_acct';
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
    var url = this.baseUrl + '/v1/read_journal_header_by_id/';
    return this.httpClient.post<IJournalDetail[]>(url, {
       period: period,
       period_year: period_year
      }).pipe(
      shareReplay());
  }


  readJournalHeader() {
    var url = this.baseUrl + '/v1/read_journal_header';
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
      amount: header.amount
    }
    return this.httpClient.post<any>(url, journalHeaderUpdate).pipe(
      catchError(err => {
          const message = "Could not save journal header ...";
          console.debug(message, err);
          this.message(message); 
          return throwError(() => new Error(`Invalid time ${ err }`));         
      }),
      shareReplay()
    )
    .subscribe();
  }

  deleteJournalHeader(journal_id: number) {
    var url = this.baseUrl + '/v1/delete_journal_header';
    return this.httpClient.post<IJournalHeader>(url,
      {
        journal_id: journal_id
      },
      ).pipe(
      shareReplay())
      .subscribe();
  }

 // set the sub_type 

  createJournalHeader(header: IJournalHeader) {
    var url = this.baseUrl + '/v1/create_journal_header';

    var journalHeader: any = {
      description: header.description,
      transaction_date: header.transaction_date,
      amount: header.amount
    }

    return this.httpClient.post<IJournalHeader>(url, journalHeader).pipe(shareReplay())
  }

  updateJournalDetail(detail: IJournalDetail){         
    var url = this.baseUrl + '/v1/update_journal_detail';    
    this.httpClient.post<IJournalDetail>(url, detail)
    .pipe(
      catchError(err => {
          this.message("Could not save journal detail"); 
          return throwError(() => new Error(`Invalid time ${ err }`));         
      }),
      shareReplay()
    ).pipe(takeUntil(this.ngDestroy$)).subscribe(data => {
      this.snackBar.open('Journal details updated ... ' + data.journal_id, 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });
    });
    
  }
  
  
  message(msg: string){
    this.snackBar.open(msg, 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-white',
      duration: 2000,
    });
  }

  deleteJournalDetail(detail: any){ 
    var url = this.baseUrl + '/v1/delete_journal_details';
    return this.httpClient.post<IJournalDetailDelete>(url, detail ).pipe(shareReplay())
  }

  createJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/create_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail ).pipe(shareReplay())
  }
  
  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

}

