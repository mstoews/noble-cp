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
import { KanbanService } from './kanban.service';
import { IKanban, IKanbanStatus, IPriority, ITeam} from 'app/models/kanban';
import { tapResponse } from '@ngrx/operators';

export interface KanbanStateInterface {
  task: IKanban;
  tasks: IKanban[];
  priority: IPriority[],
  team: ITeam[],
  types: [],
  isLoading: boolean;
  error: string | null;
}

export const KanbanStore = signalStore(
  { protectedState: false }, 
    withState<KanbanStateInterface>({
    task: null,
    tasks: [],
    types: [],
    priority: [],
    team: [],
    error: null,
    isLoading: false,
  }),
  withComputed((state) => ({

    selected: computed(() => state.tasks().filter((t) => state.tasks()[t.id])),
  })),
  withMethods((state, kanbanService = inject(KanbanService)) => ({       
    removeTask: rxMethod<IKanban>(
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
                const updatedTask = state.tasks().filter((kanban) => kanban.id !== task.id);  
                updatedTask.push(task);
                patchState(state, { tasks: updatedTask });                                 
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
                // make a copy of the tasks that were not updated
                const updatedTasks = state.tasks().filter((kanban) => kanban.id !== task.id);
                // push the task that was.
                updatedTasks.push(task);                            
                patchState(state, { tasks: updatedTasks });
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
          return kanbanService.httpReadTasks().pipe(
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
