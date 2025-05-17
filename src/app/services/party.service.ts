import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IParty } from 'app/models/party';
import { environment } from 'environments/environment';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;

  create(party: IParty) {
    var url = this.baseUrl + '/v1/create_party';
    return this.httpClient.post<IParty>(url, party).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  read() {
    var url = this.baseUrl + '/v1/read_parties';
    return this.httpClient.get<IParty[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  vendors() {
    var url = this.baseUrl + '/v1/read_vendors';
    return this.httpClient.get<IParty[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  customers() {
    var url = this.baseUrl + '/v1/read_customers';
    return this.httpClient.get<IParty[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  update(party: IParty) {
    var url = this.baseUrl + '/v1/update_party';
    return this.httpClient.post<IParty>(url, party).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  delete(party_id: string) {
    var url = this.baseUrl + '/v1/delete_party/' + party_id;
    return this.httpClient.delete(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }


}
