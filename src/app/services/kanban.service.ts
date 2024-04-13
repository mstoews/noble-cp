import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, Subject, catchError, from, map, shareReplay } from 'rxjs';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';

interface KanbanState {
  kanbans: IKanban[];
  error: string | null;
}

export interface IKanbanStatus {
  id: string,
  status: string,
  rankid: string,
}

export interface ITeam  {
    team_member: string,
    first_name: string,
    last_name: string,
    location: string,
    title: string,
    updatedte: string,
    updateusr: string
}

export interface IKanbanType {
    type: string,
    description: string,
    updatedte: string,
    updateusr: string
}

export interface IStatus {
  status: string,
  description: string,
  updatedte: string,
  updateusr: string
}

export interface IPriority {
  priority: string,
  description: string,
  updatedte: string,
  updateusr: string
}

export interface IType {
  type: string,
  description: string,
  updatedte: string,
  updateusr: string
}


export interface IKanban {
  id: string,
  title: string,
  status: string,
  summary: string,
  type: string,
  priority: string,
  tags: string,
  estimate: string,
  assignee: string,
  rankid: string,
  color: string,
  className: string,
  updateUser: string,
  updateDate: string
}

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;

  error$ = new Subject<string>();
  kanbans = computed(() => this.state().kanbans);
  error = computed(() => this.state().error);

  private state = signal<KanbanState>({
    kanbans: [],
    error: null,
  });

  // Priority
  getPriorityList() {
    var url = this.baseUrl + '/v1/task_priority_list';
    return this.httpClient.get<IPriority[]>(url).pipe(
      shareReplay());
  }

  getTypeList() {
    var url = this.baseUrl + '/v1/task_type_list';
    return this.httpClient.get<IType[]>(url).pipe(
      shareReplay());
  }

  getStatusList() {
    var url = this.baseUrl + '/v1/task_status_list';
    return this.httpClient.get<IStatus[]>(url).pipe(
      shareReplay());
  }

  getTeamList() {
    var url = this.baseUrl + '/v1/task_team_list';
    return this.httpClient.get<ITeam[]>(url).pipe(
      shareReplay());
  }


  create(k: IKanban) {
    var url = this.baseUrl + '/v1/task_create';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];

    var data: any = {
      title: k.title,
      status: k.status,
      summary: k.summary,
      type: k.type,
      priority: k.priority,
      tags: k.tags,
      estimate: k.estimate,
      assignee: k.assignee,
      rankid: k.rankid,
      color: k.color,
      className: k.className,
      updateDate: updateDate,
      updateUser: email,
    }

    return this.httpClient.post(url, data)
      .pipe(
      shareReplay()).pipe().subscribe(kanban =>
        console.log(JSON.stringify(kanban))
      );
  }

  // Read
  read() {
    var url = this.baseUrl + '/v1/tasks_list';
    return this.httpClient.get<IKanban[]>(url).pipe(
      shareReplay());
  }

  getAll() {
    return this.read();
  }

  // Update
  update(k: IKanban) {
    var url = this.baseUrl + '/v1/task_update';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];

    var data: IKanban = {
      id: k.id,
      title: k.title,
      status: k.status,
      summary: k.summary,
      type: k.type,
      priority: k.priority,
      tags: k.tags,
      estimate: k.estimate,
      assignee: k.assignee,
      rankid: k.rankid,
      color: k.color,
      className: 'classna',
      updateDate: updateDate,
      updateUser: email,
    }

    return this.httpClient.post<IKanban>(url, data);

  }

  updateStatus(k: any) {
    var url = this.baseUrl + '/v1/task_update_status';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];

    var data = {
      id: k.id,
      status: k.status,
      rankid: k.rankid,
    }

    return this.httpClient.post<IKanban>(url, data)
      .pipe(
        shareReplay()).subscribe(
          kanban => console.log(JSON.stringify(kanban),
          error => console.log('Error', error))
      );
  }

  copy(id: string){
    var data = {
      Id: id
    }
    var url = this.baseUrl + '/v1/kanban_copy';
    return this.httpClient.post<IKanban[]>(url, data)
    .pipe(
      shareReplay()).pipe().subscribe(
        kanban => console.log(JSON.stringify(kanban),
        error => console.log('Error', error)
        )
      );
  }

  // Delete
  delete(id: string) {
    var data = {
      Id: id
    }
    var url = this.baseUrl + '/v1/kanban_delete';
    return this.httpClient.post<IKanban[]>(url, data)
    .pipe(
      shareReplay()).pipe().subscribe(
        kanban => console.log(JSON.stringify(kanban),
        error => console.log('Error', error)
        )
      );
  }
}


 /*
  {
    "id": "2",
    "priority": "High",
    "rankid": 1,
    "status": "InProgress",
    "summary": "Month end expense transaction creation and documentation of expenses" ,
    "tags": "month-end",
    "title": "Another Accounting Task",
    "type": "Update",
    "updatedate": "2024-03-23",
    "updateuser": "mstoews"
    }
  */
