import { BehaviorSubject, Observable, Subject, map, mergeMap, retry, shareReplay, toArray } from 'rxjs';
import { Injectable, computed, inject, signal } from '@angular/core';

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
  fullDescription?: string,
  updatedte?: string,
  updateusr?: string
}

export interface IPriority {
  Priority: string,
  Description: string,
  updatedte: string,
  updateusr: string
}

export interface IType {
  type: string,
  description: string,
  fullDescription?: string,
  updatedte: string,
  updateusr: string
}

export interface IFund {
  fund: string,
  description: string,
  fullDescription?: string,
  updatedte: string,
  updateusr: string
}


export interface ITeam {
  id?: string;
  type: string;
  reporting: string;
  description: string;
  email: string;
  image: string;
  uid: string;
  updateDate: string;
  updateUsr: string;  
  update_dte: string,
  update_usr: string
}

export interface IKanban {
  id: number,
  title: string,
  status: string,
  summary: string,
  type: string,
  priority: string,
  tags: string,
  estimate: string,
  assignee: string,
  rankid: number,
  color: string,
  className: string,
  updateUser: string,
  updateDate: string,
  startDate: string,
  estimateDate: string
}

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  
  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);
  private baseUrl = environment.baseUrl;
  private subject = new BehaviorSubject<IKanban[]>([]);

  tasks$ : Observable<IKanban[]> = this.subject.asObservable();

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

  readTypes() {
    var url = this.baseUrl + '/v1/task_type_list';
    return this.httpClient.get<IType[]>(url).pipe(
      shareReplay());
  }

  readFullTypes() {
    var url = this.baseUrl + '/v1/task_type_list';
    return this.httpClient.get<IType[]>(url).pipe(
      mergeMap(data => data),
      map((type) => {
        return <IType> {
          type: type.type,
          description: type.description,
          fullDescription: `${type.type} - ${type.description}`,          
        }
      }
    ),
    toArray());
  }

  readStatus() {
    var url = this.baseUrl + '/v1/task_status_list';
    return this.httpClient.get<IStatus[]>(url).pipe(retry(3));    
  }

  readFullStatus() {
    var url = this.baseUrl + '/v1/task_status_list';
    return this.httpClient.get<IStatus[]>(url).pipe(
      mergeMap(data => data),
      map((s) => {
        return <IStatus> {
          status: s.status,
          description: s.description,
          fullDescription: `${s.status} - ${s.description}`,          
        }
      }
    ),
    toArray());
  }

  readTeams() {
    var url = this.baseUrl + '/v1/task_team_list';
    return this.httpClient.get<ITeam[]>(url).pipe(
      shareReplay());
  }

  getKanbanTaskList() {
    var url = this.baseUrl + '/v1/tasks_list';
    return this.httpClient.get<IKanban[]>(url).pipe(
      retry(3)).pipe(shareReplay());    
  }

  create(k: IKanban) {
    var url = this.baseUrl + '/v1/task_create';
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
      assignee: k.assignee,
      rankid: k.rankid,
      color: k.color,
      estimate: k.estimate,
      className: 'class',
      updateDate: updateDate,
      updateUser: email,
      startDate : k.startDate,
      estimateDate : k.estimateDate

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


  // Update
  update(k: IKanban) {
    var url = this.baseUrl + '/v1/task_update';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];

    // var dt = {
    //     "id": 1,
    //     "estimate_date" : "2024-05-10",
    //     "priority" : "Critical",
    //     "rankid": 3,
    //     "estimate": 1.5,
    //     "start_date": "2024-04-18",
    //     "status": "Review",
    //     "summary": "Month end expenses updates ... ",
    //     "tags":"weekly",
    //     "color": "#238823",
    //     "assignee": "mstoews",
    //     "title":"Create Initial Journal Entries",
    //     "type": "Update",
    //     "updatedate": "2024-03-29",
    //     "updateuser": "mstoews@hotmail.com"
    // }
    
    var data = {
      id: k.id,
      title: k.title,
      status: k.status,
      summary: k.summary,
      type: k.type,
      priority: k.priority,
      tags: k.tags,
      assignee: k.assignee,
      rankid: 1,
      color: k.color,
      estimate: 1.2,
      updateDate: updateDate,
      updateUser: email,
      startDate: k.startDate,
      estimateDate: k.estimateDate
    }

    this.httpClient.post<any>(url, data).pipe(shareReplay()).subscribe();

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
      priority:  k.priority
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
