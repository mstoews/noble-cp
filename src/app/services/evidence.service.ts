import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { catchError, debounceTime, distinctUntilChanged, shareReplay, throwError } from 'rxjs';
import { IArtifacts } from 'app/models/journals';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  httpClient = inject(HttpClient)
  toastr = inject(ToastrService);
  private baseUrl = environment.baseUrl;

  constructor() { }

  create(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/create_evidence';
    return this.httpClient.post<IArtifacts>(url, evidence).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  update(evidence: IArtifacts) {
    var url = this.baseUrl + '/v1/update_evidence';
    return this.httpClient.post<IArtifacts>(url, evidence).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  read() {
    var url = this.baseUrl + '/v1/read_evidence';
    return this.httpClient.get<IArtifacts[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  readById(journal_id: number) {
    var url = this.baseUrl + '/v1/read_artifacts_by_jrn_id/' + journal_id;
    return this.httpClient.get<IArtifacts[]>(url).pipe(debounceTime(1000), distinctUntilChanged()).pipe(
      catchError(err => {
        const message = "Failed to retrieve evidence ...";
        this.ShowAlert(message, 'failed');
        return throwError(() => new Error(`${JSON.stringify(err)}`));
      }), shareReplay({ bufferSize: 1, refCount: true }));
  }

  ShowAlert(message: string, response: string) {
    if (response == "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
  }

}
