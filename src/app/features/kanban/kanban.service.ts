
import { Injectable, computed, inject, signal } from '@angular/core';
import { AUTH } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { IStatus, IPriority, ITeam, IKanban, IType, IProjects } from 'app/models/kanban';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
    

  private httpClient = inject(HttpClient);
  private authService = inject(AUTH);  
  private baseUrl = environment.baseUrl;
  
  teamUrl = this.baseUrl + `/v1/team_read`; 
  updateTaskUrl = this.baseUrl + 'v1/task_update'
  priorityUrl = this.baseUrl + '/v1/task_priority_list';
  statusUrl = this.baseUrl + '/v1/task_status_list';

  httpReadStatus() {
    return this.httpClient.get<IStatus[]>(this.statusUrl);
  }

  httpReadPriority() {
    return this.httpClient.get<IPriority[]>(this.priorityUrl);
  }

  httpReadTeam() {
    return this.httpClient.get<ITeam[]>(this.teamUrl);
  }

  httpReadTypes() {
    return this.httpClient.get<IType[]>(this.baseUrl + '/v1/task_type_list');
  }

  updateTask(task: IKanban) {
    return this.httpClient.post<IKanban[]>(this.updateTaskUrl, task);
  }
  
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
      kanban_type: k.kanban_type,
      priority: k.priority,
      tags: k.tags,
      assignee: k.assignee,
      rankid: Number(k.rankid),
      color: k.color,
      estimate: Number(k.estimate),
      className: 'class',
      updatedate: updateDate,
      updateuser: email,
      startdate: startDate,
      estimatedate: estimateDate
    }
    return this.httpClient.post<IKanban>(url, data);
  }

  readTeams() {
    var url = this.baseUrl + '/v1/read_task_team';
    return this.httpClient.get<ITeam[]>(url)
  }

  getTeamMember(member: string) {
    var url = this.baseUrl + '/v1/read_team_member?memberId' + member;
    return this.httpClient.get<ITeam[]>(url)
  }


  httpReadTasks() {
    const taskUrl = this.baseUrl + '/v1/tasks_list';
    return this.httpClient.get<IKanban[]>(taskUrl);
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


  create(kanban: IKanban) {
    var url = this.baseUrl + '/v1/create_task';
    var email = this.authService.currentUser.email;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const startDate = new Date(kanban.startdate).toISOString().split('T')[0];
    const estimateDate = new Date(kanban.estimatedate).toISOString().split('T')[0];

    kanban.estimatedate = estimateDate;
    kanban.startdate = startDate;
    kanban.updatedate = updateDate;
    kanban.updateuser = email;
    kanban.estimate = Number(kanban.estimate)
    
    return this.httpClient.post<IKanban>(url,kanban);
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

    // projects

    readProjects () {
      var url = this.baseUrl + '/v1/project_list';
      return this.httpClient.get<IProjects[]>(url);
    }

    updateProjects (project: IProjects) {
      var url = this.baseUrl + '/v1/project_update';
      return this.httpClient.post<IProjects>(url, project);
    }

    deleteProjects (project: IProjects)  {
      var url = this.baseUrl + '/v1/project_delete';
      return this.httpClient.post<IProjects>(url, project);
    }

    createProjects (project: IProjects)  {
      var url = this.baseUrl + '/v1/project_create';
      return this.httpClient.post<IProjects>(url, project);
    }
}
