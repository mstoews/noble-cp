import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';

export interface ITeam {
  team_member: string,
  first_name: string,
  last_name: string,
  location: string,
  title: string,
  updatedte: Date,
  updateusr: string
}


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  httpClient = inject(HttpClient)
  private baseUrl = environment.baseUrl;

  constructor() { }

  createEvidence(team: ITeam) {
    var url = this.baseUrl + '/v1/team_create';

    var data: ITeam = {
      team_member: team.team_member,
      first_name: team.first_name,
      last_name: team.last_name,
      location: team.location,
      title: team.title,
      updatedte: team.updatedte,
      updateusr: team.updateusr  
    }

    return this.httpClient.post<ITeam>(url, data).pipe(
      shareReplay())
  }

  listTeamMembers() {
    var url = this.baseUrl + '/v1/team_list';
    return this.httpClient.get<ITeam[]>(url).pipe(
      shareReplay())
  }
}
