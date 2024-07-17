import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, shareReplay, take, takeUntil, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IAccounts, 
         IJournalDetail, 
         IJournalDetailDelete, 
         IJournalHeader, 
         IJournalHeaderUpdate, 
         IJournalTemplate, 
         IPeriod, 
         ITransactionDate } from 'app/models/journals';

@Injectable({
  providedIn: 'root'
})
export class ARJournalService implements OnDestroy  {
  
  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  private baseUrl = environment.baseUrl;
  ngDestroy$ = new Subject();

  // Journal Header signal
  journalHeaderList = signal<IJournalHeader[]>([]);
  
  // Journal Detail signal
  journalDetailList = signal<IJournalDetail[]>([]);
    
  readJournalHeaderById(journal_id: number) {
    if (this.journalHeaderList().length > 0)  {
      return this.journalHeaderList().find(item => item.journal_id === journal_id)
    }
  }

  addJournalHeaderSignal(journalItem: IJournalHeader){
    this.journalHeaderList.update(items => [...items, journalItem]);
    
  }

  updateJournalHeaderSignal(journalItem: IJournalHeader){
    this.journalHeaderList.update(items => items.map(item => item.journal_id === journalItem.journal_id ? 
        journalItem : item
    ));
  }

  deleteJournalHeaderSignal(journalItem: IJournalHeader){
    this.journalHeaderList.update(items => items.filter(item => item.journal_id != journalItem.journal_id));
  }

  readJournalHeaderSignal() {
    return this.journalHeaderList;
  }

  
  addJournalDetailSignal(journalItem: IJournalDetail){
    this.journalDetailList.update(items => [...items, journalItem]);
  
  }

  updateJournalDetailSignal(journalItem: IJournalDetail){
    this.journalDetailList.update(items => items.map(item => item.journal_subid === journalItem.journal_subid ? 
        journalItem : item
    ));
  }

  deleteJournalDetailSignal(journalItem: IJournalDetail){
    this.journalDetailList.update(items => items.filter(item => item.journal_subid != journalItem.journal_subid));
  }

  reNumberJournaldetailSignal(journal_id : number) {
    var n = 1;
    this.journalDetailList().forEach(item => {
      item.journal_subid = n;
      this.updateJournalDetailSignal(item);
      n++;
    })
  }

  readJournalDetailSignal() {
    return this.journalDetailList;
  }

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

  reNumberJournalDetail(journal_id: number ) {
    var url = this.baseUrl + '/v1/renumber_journal_details';
    const update = {
      journal_id : journal_id
    }
    return this.httpClient.post(url, update)
    .pipe(tap(results => console.log(results)),
    take(1),
    catchError(err => {
        const message = "Could not retrieve journals ...";
        console.debug(message, err);
        this.message(message); 
        return throwError(() => new Error(`${ JSON.stringify(err) }`));         
    }),
    shareReplay()
  ).subscribe();
  }

  getHttpJournalDetails(journal_id: number) {
    
    var url = this.baseUrl + '/v1/get_journal_detail/'+journal_id;
    return this.httpClient.get<IJournalDetail[]>(url)
  }

  getJournalDetail(journal_id: number) {
    var url = this.baseUrl + '/v1/get_journal_detail/'+journal_id;
    this.httpClient.get<IJournalDetail[]>(url).pipe(
        tap(data => this.journalDetailList.set(data)),
        take(1),
        catchError(err => {
            const message = "Could not retrieve journals ...";
            console.debug(message, err);
            this.message(message); 
            return throwError(() => new Error(`${ JSON.stringify(err) }`));         
        }),
        shareReplay()
      ).subscribe();
      return this.journalDetailList;
  }

  updateJournalDetailList(journalDetail: IJournalDetail[]) {
    this.journalDetailList.set(journalDetail);
  }

  
  readHttpJournalHeader() {  
    var url = this.baseUrl + '/v1/read_journal_header';
    return this.httpClient.get<IJournalHeader[]>(url)
  }
 
  readJournalHeader() {
    this.readHttpJournalHeader().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(data => this.journalHeaderList.set(data)),
      take(1),
      catchError(err => {
          const message = "Could not retrieve journals ...";
          console.debug(message, err.statusText);
          this.message(message); 
          if (err.statusText === "Unauthorized")
            {
              this.router.navigate(['sign-out']);            
            }
          return throwError(() => new Error(`${ JSON.stringify(err.statusText) }`));         
      }),
      shareReplay()
    ).subscribe();
    return this.journalHeaderList;
  }

   getJournalAccountsByPeriod(period:  number , periodYear: number, child: number) {
        var url = this.baseUrl + '/v1/read_journal_by_account';
        return this.httpClient.post(url, {
         period: period,
         period_year: periodYear,
         child: child
        });
    }

    readJournalDetails(period:  number , periodYear: number, child: number) {
      var url = this.baseUrl + '/v1/read_journal_by_account';
      return this.httpClient.post(url, {
       period: period,
       period_year: periodYear,
       child: child
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
      tap(data => this.updateJournalHeaderSignal(data)),
      take(1),
      catchError(err => {
          const message = "Could not save journal header :"  + err.statusText;          
          this.router.navigate(['auth/login']);
          return throwError(() => new Error(`Invalid time ${ err.statusText }`));         
      }),
      shareReplay()
    ).subscribe();

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
      // tap( data => this.updateJournalDetailSignal(detail)),
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


  updateHttpJournalDetail(detail: IJournalDetail) {         
    var url = this.baseUrl + '/v1/update_journal_detail';    
    return this.httpClient.post<IJournalDetail>(url, detail);      
  }

  
  message(msg: string){
    this.snackBar.open(msg, 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-white',
      duration: 2000,
    });
  }



  deleteHttpJournalDetail(journal_id: number, journal_subid: number) { 
    const detail = {
      journal_id: journal_id,
      journal_subid : journal_subid
    }
    var url = this.baseUrl + '/v1/delete_journal_details';
    return this.httpClient.post<IJournalDetailDelete>(url, detail)     
  }


  deleteJournalDetail(detail: any){ 
    var url = this.baseUrl + '/v1/delete_journal_details';
    this.httpClient.post<IJournalDetailDelete>(url, detail )
    .pipe(
      tap (data => { 
        console.log('deleted journal id', data);
        this.deleteJournalDetailSignal(detail)
      }),
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


  // add a line to journal detail

  createHttpJournalDetail(detail: IJournalDetail) {
    var url = this.baseUrl + '/v1/create_journal_detail';
    return this.httpClient.post<IJournalDetail>(url, detail);    
  }

  createJournalDetail(detail: any){     
    this.createHttpJournalDetail(detail)
    .pipe(
      tap (data => { 
        console.log('added journal id', data);
        this.addJournalDetailSignal(detail)
      }),
      catchError(err => {
          this.message("Could not save journal detail"); 
          return throwError(() => new Error(`Invalid time ${ err }`));         
      }),
      shareReplay()
    ).pipe(takeUntil(this.ngDestroy$)).subscribe(data => {
      this.snackBar.open('Journal detail added ... ' + data.journal_id, 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 2000,
      });      
    });
    
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

}

