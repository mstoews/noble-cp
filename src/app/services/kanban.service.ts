import { BehaviorSubject, Observable, Subject, catchError, map, mergeMap, of, retry, shareReplay, take, tap, toArray } from 'rxjs';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

interface KanbanState {
  kanbans: IKanban[];
  error: string | null;
}

export interface IKanbanStatus {
  id: string,
  status: string,
  rankid: string,
}

export interface ITeam {
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
  updatedte?: string,
  updateusr?: string
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
  id?: number,
  title: string,
  status: string,
  summary: string,
  type: string,
  priority: string,
  tags: string,
  estimate: number,
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

  tasks$: Observable<IKanban[]> = this.subject.asObservable();

  kanbanList = signal<IKanban[]>([]);
  statusList = signal<IStatus[]>([]);
  typeList = signal<IType[]>([]);
  statusFullList = signal<IStatus[]>([]);


  error$ = new Subject<string>();
  kanbans = computed(() => this.state().kanbans);
  error = computed(() => this.state().error);

  private state = signal<KanbanState>({
    kanbans: [],
    error: null,
  });

  // Priority
  async getPriorityList() {
    var url = this.baseUrl + '/v1/task_priority_list';
    return this.httpClient.get<IPriority[]>(url).pipe(
      shareReplay());
  }


  readFullTypes() {
    var url = this.baseUrl + '/v1/task_type_list';
    const sub = this.httpClient.get<IType[]>(url).pipe(
      tap(data => this.typeList.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as IType[]))
    ).subscribe();
    return this.typeList;
  }


  readStatus() {
    const url = this.baseUrl + '/v1/task_status_list';
    const sub = this.httpClient.get<IStatus[]>(url).pipe(
      tap(data => this.statusList.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as IStatus[]))
    ).subscribe();
    return this.statusList;
  }

  readTypes() {
    var url = this.baseUrl + '/v1/task_type_list';
    const sub = this.httpClient.get<IType[]>(url).pipe(
      tap(data => this.typeList.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as IType[]))
    ).subscribe();
    return this.typeList;
  }


  readFullStatus() {
    var url = this.baseUrl + '/v1/task_status_list';
    const sub2 = this.httpClient.get<IStatus[]>(url).pipe(
      tap(data => this.statusFullList.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as IStatus[]))
    ).subscribe();
    // pipe(mergeMap(data => data),
    // map((s) => {
    //   var status = <IStatus> {
    //     status: s.status,
    //     description: s.description,
    //     fullDescription: `${s.status} - ${s.description}`,          
    //   }
    // }))
    return this.statusFullList;

  }

  readTeams() {
    var url = this.baseUrl + '/v1/read_task_team';
    return this.httpClient.get<ITeam[]>(url).pipe(
      shareReplay());
  }

  getTeamMember(member: string) {
    var url = this.baseUrl + '/v1/read_team_member?memberId' + member;
    return this.httpClient.get<IKanban[]>(url).pipe(
      retry(3)).pipe(shareReplay());
  }

  readTasks() {
    var url = this.baseUrl + '/v1/tasks_list';
    return this.httpClient.get<IKanban[]>(url).pipe(
      retry(3)).pipe(shareReplay());
  }


  createTeamMember(t: ITeam) {
    var data = {
      id: t.id,
      type: t.type,
      reporting: t.reporting,
      description: t.description,
      email: t.email,
      image: t.image,
      uid: t.uid,
      updateDate: t.updateDate,
      updateUsr: t.updateUsr,
      update_dte: t.update_dte,
      update_usr: t.update_usr
    }
  }


  create(k: IKanban) {
    var url = this.baseUrl + '/v1/create_task';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const startDate = new Date(k.startDate).toISOString().split('T')[0];
    const estimateDate = new Date(k.estimateDate).toISOString().split('T')[0];

    k.estimateDate = estimateDate;
    k.startDate = startDate;
    k.updateDate = updateDate;
    k.updateUser = email;
    k.estimate = Number(k.estimate)

  
    console.debug(JSON.stringify(k))
    return this.httpClient.post<IKanban>(url,k).pipe(
        shareReplay())
    }

    updateKanbanList(kanban: IKanban)  {
      this.kanbanList.update(items => [...items, kanban])        
    }
  
  // Read
  
  read() {
    var url = this.baseUrl + '/v1/tasks_list';
    const sub = this.httpClient.get<IKanban[]>(url).pipe(
      tap(data => this.kanbanList.set(data)),
      take(1),
      catchError(() => of([] as IKanban[]))
    ).subscribe();
    return this.kanbanList;
  }

  // Update
  async update(k: IKanban) {
    var url = this.baseUrl + '/v1/task_update';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const startDate = new Date(k.startDate).toISOString().split('T')[0];
    const estimateDate = new Date(k.estimateDate).toISOString().split('T')[0];

    var data = {
      id: k.id,
      title: k.title,
      status: k.status,
      summary: k.summary,
      type: k.type,
      priority: k.priority,
      tags: k.tags,
      assignee: k.assignee,
      rankid: Number(k.rankid),
      color: k.color,
      estimate: k.estimate,
      className: 'class',
      updateDate: updateDate,
      updateUser: email,
      startDate: startDate,
      estimateDate: estimateDate
    }

    this.kanbanList.update(items =>
      items.map(item => item.id === data.id ? {
        id: data.id,
        title: data.title,
        status: data.status,
        summary: data.summary,
        type: data.type,
        priority: data.priority,
        tags: data.tags,
        assignee: data.assignee,
        rankid: data.rankid,
        color: data.color,
        estimate: data.estimate,
        className: data.className,
        updateDate: data.updateDate,
        updateUser: data.updateUser,
        startDate: data.startDate,
        estimateDate: data.estimateDate
      } : item));

    console.debug('Updated signal ...');

    var sub = this.httpClient.post<IKanban>(url, data)
      .pipe(
        shareReplay()).subscribe(
          kanban => console.log(JSON.stringify(kanban),
          error => console.log('Error', error))
        );
  }

  updateStatusStatic(s: IStatus){
    var url = this.baseUrl + '/v1/task_status_update';

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
      priority: k.priority
    }

    return this.httpClient.post<IKanban>(url, data)
      .pipe(
        shareReplay()).subscribe(
          kanban => console.log(JSON.stringify(kanban),
          error => console.log('Error', error))
        );
  }

  copy(id: string) {
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
