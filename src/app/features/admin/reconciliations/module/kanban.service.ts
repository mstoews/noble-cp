/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as glossApi from 'app/services/api.service';
import { ITask } from './tasks.model';

export type TaskArray = {
  tasks: ITask[];
};

@Injectable()
export class KanbanService {
  public PRIORITY: glossApi.Kb_Priority[];

  private partyRef: string;
  private partyType: string;
  private isPartyTypeSelected: boolean;

  constructor(
    // Kanban Task
    private readonly kanbanTasks: glossApi.KanbanTasksGQL,
    private readonly kanbanPriority: glossApi.KanbanPriorityGQL,
    private readonly kanbanByStatus: glossApi.KanbanByStatusGQL,
    private readonly kanbanUpdateTask: glossApi.UpdateTaskGQL,
    private readonly kanbanCreateTask: glossApi.CreateKanbanTaskGQL,
    private readonly kanbanStatus: glossApi.KanbanStatusGQL,
    private readonly kanbanType: glossApi.KanbanTypeGQL,
    private readonly kanbanDeleteTask: glossApi.DeleteTaskGQL,
    private readonly kanbanTaskByRefAndStatus: glossApi.KanbanTaskByRefAndStatusGQL,
    private readonly kanbanTaskByRef: glossApi.KanbanTaskByRefGQL,
    private readonly firstKanbanTask: glossApi.KanbanFirstTaskGQL,
    private readonly kanbanTaskByTaskId: glossApi.KanbanTaskByTaskIdGQL,
    private readonly updateTaskParentId: glossApi.UpdateTaskParentIdGQL,
    private readonly partyByTypeGQL: glossApi.PartyByTypeGQL,
    private readonly firstPartyByTypeGQL: glossApi.FirstPartyByTypeGQL,
    private readonly getPartyByRefGQL: glossApi.PartyGQL,
    private readonly getPartyByTypeGQL: glossApi.PartyByTypeGQL
  ) {}

  clientRef = 'CORE';

  public getFirstPartyByType(partyType: string) {
    return this.firstPartyByTypeGQL
      .watch({ party_type: partyType, client_ref: 'CORE' })
      .valueChanges.pipe(map((result) => result.data.firstPartyByType));
  }

  public getPartyByType(partyType: string) {
    return this.getPartyByTypeGQL
      .watch({ party_type: partyType, client_ref: this.clientRef })
      .valueChanges.pipe(map((result) => result.data.partyByType));
  }

  public getPartyByRef(partyRef: string) {
    return this.getPartyByRefGQL
      .watch({
        party_ref: partyRef,
        client_ref: this.clientRef,
      })
      .valueChanges.pipe(map((result) => result.data.party));
  }

  public getPartyByRefAndClient(party_type: string, client_ref: string) {
    return this.partyByTypeGQL
      .watch({ party_type, client_ref })
      .valueChanges.pipe(map((result) => result.data.partyByType));
  }

  public getFirstKanbanTaskRef() {
    return this.firstKanbanTask
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanFirstTask));
  }

  public getTaskbyTaskId(taskId: string) {
    return this.kanbanTaskByTaskId
      .watch({ task_id: taskId })
      .valueChanges.pipe(map((result) => result.data.KanbanByTaskId));
  }

  public updateTaskParent(taskId: string, parentId: number) {
    return this.updateTaskParentId.mutate({
      task_id: taskId,
      parentId,
    });
  }

  public KanbanCreate(task: glossApi.KanbanInputs) {
    return this.kanbanCreateTask.mutate({
      taskInput: task,
    });
  }

  public getKanbanStatus() {
    return this.kanbanStatus
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanStatus));
  }

  public getKanbanType() {
    return this.kanbanType
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanType));
  }

  public getKanbanTasks() {
    return this.kanbanTasks
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanTask));
  }

  public getKanbanTaskByRef(partyRef: string): Observable<any> {
    return this.kanbanTaskByRef
      .watch({ party_ref: partyRef })
      .valueChanges.pipe(map((result) => result.data.KanbanTaskByRef));
  }

  public getKanbanTaskByRefAndStatus(partyRef: string, status: string) {
    return this.kanbanTaskByRefAndStatus
      .watch({ partyRef, status })
      .valueChanges.pipe(map((result) => result.data.KanbanTaskByRefAndStatus));
  }

  public getKanbanByStatus(status: string) {
    return this.kanbanByStatus
      .watch({ status })
      .valueChanges.pipe(map((result) => result.data.KanbanTaskByStatus));
  }

  public getKanbanPriorities() {
    return this.kanbanPriority
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanPriority));
  }

  public KanbanUpdate(taskId: string, taskData: glossApi.KanbanInputs) {
    return this.kanbanUpdateTask.mutate({
      task_id: taskId,
      taskInput: taskData,
    });
  }

  public kanbanDelete(task: glossApi.KanbanInputs): any {
    return this.kanbanDeleteTask.mutate({
      task_id: task.task_id,
    });
  }

  dateFormatter(params) {
    const dateAsString = params.value;
    // console.log(dateAsString.slice(0, 10));
    const dateParts = dateAsString.split('-');
    return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2].slice(0, 2)}`;
  }
}
