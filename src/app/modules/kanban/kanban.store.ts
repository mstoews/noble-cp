import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, shareReplay, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { IKanban, IKanbanStatus, IPriority, ITeam, KanbanService } from './kanban.service';
import { tapResponse } from '@ngrx/operators';

export interface KanbanStateInterface {
  tasks: IKanban[];
  priority: IPriority[],
  team: ITeam[],
  isLoading: boolean;
  error: string | null;
  tasksCount: number;
}

export const KanbanStore = signalStore(
  withState<KanbanStateInterface>({
    tasks: [],
    priority: [],
    team: [],
    error: null,
    isLoading: false,
    tasksCount: 0
  }),
  withComputed((state) => ({
    tasksCount: computed(() => state.tasks().length),
    selected: computed(() => state.tasks().filter((t) => state.tasks()[t.id])),
  })),
  withMethods((state, kanbanService = inject(KanbanService)) => ({       
    removeTask:   rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return kanbanService.delete(value.id).pipe(
            tapResponse({
              next: (task) => {
                patchState(state, { tasks: state.tasks().filter((kanban) => kanban.id !== value.id) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    addTask:  rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return kanbanService.create(value).pipe(
            tapResponse({
              next: (task) => {
               patchState(state, { tasks: [...state.tasks(), task] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateTask: rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          // patchState(state, { isLoading: true });
          return kanbanService.update(value).pipe(
            tapResponse({
              next: (task) => {
                const updatedTasks = state.tasks().filter((kanban) => kanban.id !== task.id);
                patchState(state, { tasks: updatedTasks });
                const currentTasks = state.tasks();
                const updateTask = [task, ...currentTasks.slice(1)];
                patchState(state, {tasks: updateTask})
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateStatus: rxMethod<IKanbanStatus>(
      pipe(
        switchMap((value) => {
          // patchState(state, { isLoading: true });
          return kanbanService.updateStatus(value).pipe(
            tapResponse({
              next: (task) => {
                // make a copy of the task to update
                const taskToUpdate = state.tasks().filter((kanban) => kanban.id === task.id);
                // remove the copy from the array
                const updatedTasks = state.tasks().filter((kanban) => kanban.id !== task.id);
                patchState(state, { tasks: updatedTasks });                
                // update the copy and add it back to the array of tasks
                var taskCopy = taskToUpdate[0];
                taskCopy.priority = value.priority;
                taskCopy.status = value.status;                
                patchState(state, { tasks: [...state.tasks(), taskCopy]});
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    addTasks: rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return kanbanService.create(value).pipe(
            tapResponse({
              next: (task) =>  patchState(state, { tasks : [...state.tasks(), value ]}),             
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadPriority: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return kanbanService.httpReadPriority().pipe(
            tapResponse({
              next: (priorities) => patchState(state, { priority: priorities }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadAssignee: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return kanbanService.httpReadTeam().pipe(
            tapResponse({
              next: (team) => patchState(state, { team: team }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadTasks: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return kanbanService.getTasks().pipe(
            tapResponse({
              next: (tasks) => patchState(state, { tasks: tasks }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadTasks();
      store.loadPriority();
      store.loadAssignee();
    },
  })
);
