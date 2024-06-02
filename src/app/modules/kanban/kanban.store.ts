import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { IKanban, KanbanService } from './kanban.service';
import { tapResponse } from '@ngrx/operators';

export interface KanbanStateInterface {
  tasks: IKanban[];
  isLoading: boolean;
  error: string | null;
}

export const KanbanStore = signalStore(
  withState<KanbanStateInterface>({
    tasks: [],
    error: null,
    isLoading: false,
  }),
  withComputed((store) => ({
    tasksCount: computed(() => store.tasks().length),
  })),
  withMethods((store, kanbanService = inject(KanbanService))  => ({
    addTask(task: IKanban) {      
      const updatedTasks = [...store.tasks(), task];
      patchState(store, { tasks: updatedTasks });
    },
    removeTask(id: number) {
      const updatedTasks = store.tasks().filter((kanban) => kanban.id !== id);
      patchState(store, { tasks: updatedTasks });
    },
    updateTask(task: IKanban) {
      const updatedTasks = store.tasks().filter((kanban) => kanban.id !== task.id);
      patchState(store, { tasks: updatedTasks });            
      const addTasks = [...store.tasks(), task];
      patchState(store, { tasks: addTasks });
    },
    updatingTask: rxMethod<IKanban>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        exhaustMap(() => {
          return kanbanService.getTasks().pipe(
            tapResponse({
              next: (tasks) => patchState(store, {tasks : tasks}),            
              error: console.error,
              finalize: () => patchState(store, {isLoading: false}),
            })
          );
        })
      )
    ),
    addTasks(tasks: IKanban[]) {
      patchState(store, { tasks });
    },
    loadTasks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        exhaustMap(() => {
          return kanbanService.getTasks().pipe(
            tapResponse({
              next: (tasks) => patchState(store, {tasks : tasks}),            
              error: console.error,
              finalize: () => patchState(store, {isLoading: false}),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadTasks();
    },
  })
);
