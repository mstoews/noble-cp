import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';
import { IArtifacts } from 'app/models/journals';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;

  constructor() { }

  createEvidence(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/create_evidence';
    return this.httpClient.post<IArtifacts>(url, evidence).pipe(shareReplay());
  }

  readEvidence() {
    var url = this.baseUrl + '/v1/read_evidence';
    return this.httpClient.get<IArtifacts[]>(url).pipe(shareReplay());
  }

  readEvidenceByJournalId(journalId: number, confirmed: boolean) {
    var evidence = { journal_id: journalId, confirmed: false };
    var url = this.baseUrl + '/v1/read_evidence_by_jrn';
    return this.httpClient.post<IArtifacts[]>(url, evidence).pipe(shareReplay());
  }

}
