import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';


export interface IEvidence {
  reference_no  : string,
	description   : string,
	location      : string,
	user_created  : string,
	date_created  : string,
}


@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;
  
  constructor() { }

   createEvidence(evidence: IEvidence) { 
    
    var url = this.baseUrl + '/v1/create_evidence';

    var data: IEvidence = {
      reference_no : evidence.reference_no,
      description : evidence.description,
      location : evidence.location,
      user_created : evidence.user_created,
      date_created : evidence.date_created
    }

    return this.httpClient.post<IEvidence>(url,data)
      .pipe(
      shareReplay()) 
  }
  
  listEvidence() {
    var url = this.baseUrl + '/v1/list_evidence';
    return this.httpClient.get<IEvidence[]>(url)
    .pipe(
    shareReplay()) 
  }

}
