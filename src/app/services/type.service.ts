import { Injectable, computed, inject, signal } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { UserService } from 'app/modules/user/user/user.service';
import { AUTH } from 'app/app.config';

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
  
  types = computed(() => this.state().types);
  error = computed(() => this.state().error);

  private state = signal<TypeState>({
    types: [],
    error: null,
  });

  
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
    var url = this.baseUrl + '/v1/type_list';
    return this.httpClient.get<IType[]>(url).pipe(
      shareReplay())
  }

  getAll() {
    return this.read();
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
