import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ITeam } from "app/models/team";
import { environment } from "environments/environment";
import { retry, shareReplay } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class TeamService {
  httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  constructor() { }

  createEvidence(team: ITeam) {
    var url = this.baseUrl + "/v1/team_create";

    var data: ITeam = {
      team_member: team.team_member,
      first_name: team.first_name,
      last_name: team.last_name,
      location: team.location,
      title: team.title,
      updatedte: team.updatedte,
      updateusr: team.updateusr,
      email: team.email,
      image: team.image,
      uid: team.uid,
    };

    return this.httpClient.post<ITeam>(url, data).pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  read() {
    var url = this.baseUrl + "/v1/team_read";
    return this.httpClient.get<ITeam[]>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  delete(memberId: string) {
    var url = this.baseUrl + "/v1/team_delete";
    return this.httpClient
      .post<ITeam[]>(url, { memberId: memberId })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  create(team: ITeam) {
    var url = this.baseUrl + "/v1/team_create";
    return this.httpClient
      .post<ITeam>(url, { team: team })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }

  update(team: ITeam) {
    var url = this.baseUrl + "/v1/team_update";
    return this.httpClient
      .post<ITeam[]>(url, { team: team })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }), retry(2));
  }
}
