import { Injectable, computed, inject, signal } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { ISubType } from 'app/models/subtypes';

interface SubtypeState {
  types: ISubType[];
  error: string | null;
}


@Injectable({
  providedIn: 'root',
})
export class SubTypeService {

  // imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;

  error$ = new Subject<string>();

  private state = signal<SubtypeState>({
    types: [],
    error: null,
  });

  types = computed(() => this.state().types);
  error = computed(() => this.state().error);

  create(t: ISubType) {
    var url = this.baseUrl + '/v1/subtype_create';

    var data: ISubType = {
      id: t.id,
      subtype: t.subtype,
      description: t.description,
      create_date: t.create_date,
      create_user: t.create_user,
      update_date: t.update_date,
      update_user: t.update_user,
    }

    return this.httpClient.post<ISubType>(url, data).pipe(
      shareReplay({ bufferSize: 1, refCount: true }))
  }

  // Read
  read() {
    var url = this.baseUrl + '/v1/subtype_list';
    return this.httpClient.get<ISubType[]>(url).pipe(
      shareReplay({ bufferSize: 1, refCount: true }))
  }

  getAll() {
    return this.read();
  }


  // Update
  update(t: ISubType) {
    var url = this.baseUrl + '/v1/subtype_update';

    var data: ISubType = {
      id: t.id,
      subtype: t.subtype,
      description: t.description,
      create_date: t.create_date,
      create_user: t.create_user,
      update_date: t.update_date,
      update_user: t.update_user,
    }

    return this.httpClient.post<ISubType>(url, data).pipe(
      shareReplay({ bufferSize: 1, refCount: true }))
  }

  // Delete
  delete(id: number) {
    var data = {
      id: id
    }
    var url = this.baseUrl + '/v1/subtype_list';
    return this.httpClient.post<ISubType[]>(url, data).pipe(
      shareReplay({ bufferSize: 1, refCount: true }))
  }



}
