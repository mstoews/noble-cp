import { Injectable, computed, inject, signal } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';

interface SubtypeState {
  types: ISubType[];
  error: string | null;
}

export interface ISubType {
  subtype: string,
  description: string,
  create_date: Date,
  create_user: string,
  update_date: Date,
  update_user: string
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
      subtype: t.subtype,
      description: t.description,
      create_date: t.create_date,
      create_user: t.create_user,
      update_date: t.update_date,
      update_user: t.update_user,
    }

    return this.httpClient.post<ISubType>(url, data).pipe(
      shareReplay())
  }
  
  // Read
  read() {
    var url = this.baseUrl + '/v1/subtype_list';
    return this.httpClient.get<ISubType[]>(url).pipe(
      shareReplay())
  }

  getAll() {
    return this.read();
  }


    // Update
    update(t: ISubType) {
      var url = this.baseUrl + '/v1/subtype_update';
  
      var data: ISubType = {
        subtype: t.subtype,
        description: t.description,
        create_date: t.create_date,
        create_user: t.create_user,
        update_date: t.update_date,
        update_user: t.update_user,
      }
  
      return this.httpClient.post<ISubType>(url, data).pipe(
        shareReplay())
    }
    
  // Delete
  delete(id: string) {
    var data = {
      type: id
    }
    var url = this.baseUrl + '/v1/subtype_list';
    return this.httpClient.post<ISubType[]>(url, data).pipe(
      shareReplay()) 
  }



}
