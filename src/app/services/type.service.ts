import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, catchError, of, shareReplay, take, tap, throwError } from 'rxjs';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface TypeState {
  types: IType[];
  error: string | null;
}

export interface IType {
  type: string,
  description: string,
  create_date: Date,
  create_user: string,
  update_date: Date,
  update_user: string
}

@Injectable({
  providedIn: 'root',
})
export class TypeService {

  // imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);

  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  error$ = new Subject<string>();

  private typeList = signal<IType[]>([])

  create(t: IType) {
    var url = this.baseUrl + '/v1/type_create';
    var email = this.authService.currentUser.email;
    const dDate = new Date();

    var data: IType = {
      type: t.type,
      description: t.description,
      create_date: dDate,
      create_user: email,
      update_date: dDate,
      update_user: email,
    }

    return this.httpClient.post<IType>(url, data).pipe(
      shareReplay())
  }

  // Read
  read() {
    if (this.typeList().length === 0) {
      var url = this.baseUrl + '/v1/type_list';
      this.httpClient.get<IType[]>(url).pipe(
        tap(data => this.typeList.set(data)),
        take(1),
        catchError(err => {
          const message = "Could not retrieve journals ...";
          console.debug(message, err);
          return throwError(() => new Error(`${JSON.stringify(err)}`));
        }),
        shareReplay()
      ).subscribe();
    }
    return this.typeList;
  }


  // Update
  update(t: IType) {
    var url = this.baseUrl + '/v1/type_create';

    var data: IType = {
      type: t.type,
      description: t.description,
      create_date: t.create_date,
      create_user: t.create_user,
      update_date: t.update_date,
      update_user: t.update_user,
    }

    return this.httpClient.post<IType>(url, data).pipe(
      shareReplay())
  }

  // Delete
  delete(id: string) {
    var data = {
      type: id
    }
    var url = this.baseUrl + '/v1/type_list';
    return this.httpClient.post<IType[]>(url, data).pipe(
      shareReplay())
  }

}
