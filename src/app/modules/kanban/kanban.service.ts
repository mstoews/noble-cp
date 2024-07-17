import { BehaviorSubject, Observable, Subject, catchError, of, retry, shareReplay, take, tap  } from 'rxjs';
import { Injectable, computed, inject, signal } from '@angular/core';

import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { signalState, PartialStateUpdater, patchState } from '@ngrx/signals';
import { exhaustMap, pipe, throwError } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

export interface IKanbanStatus {
  id: string,
  status: string,
  rankid: string,
  priority: string
}

export interface ITeam { 
    team_member : string,
    first_name  : string,
    last_name   : string,
    location    : string,
    title       : string,
    updatedte   : string,
    updateusr   : string,
    email       : string,
    image       : string,
    uid         : string
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
  priority: string,
  description: string,
  updatedte: string,
  updateusr: string,
  color?: string
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
  updateuser: string,
  updatedate: string,
  startdate: string,
  estimatedate: string
}


@Injectable({
  providedIn: 'root',
})
export class KanbanService {
    

  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);  
  private baseUrl = environment.baseUrl;
  
  statusList = signal<IStatus[]>([]);
  priorityList = signal<IPriority[]>([]);
  teamList = signal<ITeam[]>([])
  taskList = signal<IKanban[]>([]);
  typeList = signal<IType[]>([]);
  statusFullList = signal<IStatus[]>([]);
  isLoading = signal<boolean>(false);
  
  teamUrl = this.baseUrl + `/v1/team_read`; 
  taskUrl = this.baseUrl + '/v1/tasks_list';
  updateTaskUrl = this.baseUrl + 'v1/task_update'
  priorityUrl = this.baseUrl + '/v1/task_priority_list';
  statusUrl = this.baseUrl + '/v1/task_status_list';

  readonly readPriority = rxMethod <void> (
    pipe(
      tap(() => this.isLoading.set(true)),
      exhaustMap(() => {
        return this.httpReadPriority().pipe(
          tapResponse({
            next: (priority) => this.priorityList.set(priority),            
            error: console.error,
            finalize: () => this.isLoading.set(false),
          })
        );
      })
    )
  );

  readonly readStatus = rxMethod <void> (
    pipe(
      tap(() => this.isLoading.set(true)),
      exhaustMap(() => {
        return this.httpReadStatus().pipe(
          tapResponse({
            next: (status) => this.statusList.set(status),            
            error: console.error,
            finalize: () => this.isLoading.set(false),
          })
        );
      })
    )
  );

  httpReadStatus() {
    return this.httpClient.get<IStatus[]>(this.statusUrl);
  }

  httpReadPriority() {
    return this.httpClient.get<IPriority[]>(this.priorityUrl);
  }

  httpReadTeam() {
    return this.httpClient.get<ITeam[]>(this.teamUrl);
  }

  getTasks() {
    return this.httpClient.get<IKanban[]>(this.taskUrl).pipe(
      tapResponse({            
        next: (kanban) => this.taskList.set(kanban),
        error: console.error,
        finalize: () => (this.isLoading.set(false)),
      })
    );
  }

  updateTask(task: IKanban) {
    return this.httpClient.post<IKanban[]>(this.updateTaskUrl, task);
  }

  updatePrioritySignal(priority: IPriority) {    
    this.priorityList.update(items => items.map(item => item.priority === priority.priority ? priority : item ));
  }
  
  updateTaskPriority(priority: IPriority){
    var url = this.baseUrl + '/v1/task_priority_update';
    var name = this.authService.currentUser.email.split("@")[0];
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    priority.updatedte = updateDate;
    priority.updateusr = name;
    return this.httpClient.post<IKanban>(url, priority)
    .pipe(
          tapResponse({            
            next: (kanban) => this.updatePrioritySignal(priority),
            error: console.error,
            finalize: () => (this.isLoading.set(false)),
          })
    );
  }

  readonly readTeam = rxMethod <void>  (
    pipe(
      tap(() => this.isLoading.set(true)),
      exhaustMap(() => {
        return this.httpClient.get<ITeam[]>(this.teamUrl).pipe(
          tapResponse({
            next: (team) => this.teamList.set(team),            
            error: console.error,
            finalize: () => this.isLoading.set(false),
          })
        );
      })
    )
  );

  readonly readKanban = rxMethod <void>  (
    pipe(
      tap(() => this.isLoading.set(true)),
      exhaustMap(() => {
        return this.httpClient.get<IKanban[]>(this.taskUrl).pipe(
          tapResponse({            
            next: (kanban) => this.taskList.set(kanban),
            error: console.error,
            finalize: () => (this.isLoading.set(false)),
          })
        );
      })
    )
  );

  update(k: IKanban) {
    var url = this.baseUrl + '/v1/task_update';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const startDate = new Date(k.startdate).toISOString().split('T')[0];
    const estimateDate = new Date(k.estimatedate).toISOString().split('T')[0];
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
      updatedate: updateDate,
      updateuser: email,
      startdate: startDate,
      estimatedate: estimateDate
    }
    return this.httpClient.post<IKanban>(url, data);
  }

  updateKanbanSignal(data: IKanban) {
    console.debug('Updated signal ...', JSON.stringify(data));    
    this.taskList.update(items => items.map(item => item.id === data.id ? data : item ));
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
    return this.httpClient.get<ITeam[]>(url)
  }

  getTeamMember(member: string) {
    var url = this.baseUrl + '/v1/read_team_member?memberId' + member;
    return this.httpClient.get<IKanban[]>(url)
  }

  readTasks() {
    var url = this.baseUrl + '/v1/tasks_list';
    return this.httpClient.get<IKanban[]>(url);
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
    const startDate = new Date(k.startdate).toISOString().split('T')[0];
    const estimateDate = new Date(k.estimatedate).toISOString().split('T')[0];

    k.estimatedate = estimateDate;
    k.startdate = startDate;
    k.updatedate = updateDate;
    k.updateuser = email;
    k.estimate = Number(k.estimate)
    
    return this.httpClient.post<IKanban>(url,k);
    }

    updateKanbanList(kanban: IKanban)  {
      //this.kanbanList.update(items => [...items, kanban])        
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

    return this.httpClient.post<IKanban>(url, data);
  }

  copy(id: string) {
    var data = {
      Id: id
    }
    var url = this.baseUrl + '/v1/kanban_copy';
    return this.httpClient.post<IKanban[]>(url, data);    
  }

  // Delete
  delete(id: number) {
    var data = {
      Id: id
    }
    var url = this.baseUrl + '/v1/kanban_delete';
    return this.httpClient.post<IKanban>(url, data);    
  }
}
