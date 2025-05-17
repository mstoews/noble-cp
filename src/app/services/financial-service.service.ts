import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, debounce, debounceTime, distinctUntilChanged, interval, retry, shareReplay, take, takeUntil, tap, throwError, timeout, timer } from 'rxjs';
import { environment } from 'environments/environment';
import { ToastrService } from "ngx-toastr";


export interface IFinancialData {
  child: number;
  description: string;
  type: string;
  amount: number;
  period: number;
  period_year: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialServiceService {

  constructor() { }
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private baseUrl = environment.baseUrl;

  getFinancialData(): Observable<IFinancialData[]> {
    return this.http.get<IFinancialData[]>(`${this.baseUrl}/api/financial-data`)
      .pipe((shareReplay(1)),
        debounceTime(1000),
        retry(3),
        catchError(this.handleError('Retrieving financial data')),
      );
  }
  getFinancialDataByChild(child: number): Observable<IFinancialData> {
    return this.http.get<IFinancialData>(`${this.baseUrl}/api/financial-data/${child}`)
      .pipe((shareReplay(1)),
        debounceTime(1000),
        retry(3),
        catchError(this.handleError('Retrieving financial data by ID')),
      );
  }
  handleError(handleError: any) {
    return (error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        this.toastr.error('A client-side or network error occurred.', 'Error');
      } else {
        // The backend returned an unsuccessful response code.
        this.toastr.error(`Backend returned code ${error.status}, body was: ${error.error}`, 'Error');
      }
      // Return an observable with a user-facing error message.
      return throwError(() => new Error('Something bad happened; please try again later.'));
    };
  }

}
