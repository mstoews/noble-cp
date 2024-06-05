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
import { IKanban, IPriority, KanbanService } from './kanban.service';
import { tapResponse } from '@ngrx/operators';

export interface KanbanStateInterface {
  tasks: IKanban[];
  priority: IPriority[],
  isLoading: boolean;
  error: string | null;
  tasksCount: number;
}

export const KanbanStore = signalStore(
  withState<KanbanStateInterface>({
    tasks: [],
    priority: [],
    error: null,
    isLoading: false,
    tasksCount: 0
  }),
  withComputed((store) => ({
    tasksCount: computed(() => store.tasks().length),
  })),
  withMethods((store, kanbanService = inject(KanbanService)) => ({   
    removeTask:   rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          patchState(store, { isLoading: true });
          return kanbanService.delete(value.id).pipe(
            tapResponse({
              next: (task) => {
                patchState(store, { tasks: store.tasks().filter((kanban) => kanban.id !== value.id) });
              },
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    addTask:  rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          patchState(store, { isLoading: true });
          return kanbanService.create(value).pipe(
            tapResponse({
              next: (task) => {
               patchState(store, { tasks: [...store.tasks(), task] });
              },
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateTask: rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          patchState(store, { isLoading: true });
          return kanbanService.update(value).pipe(
            tapResponse({
              next: (task) => {
                const updatedTasks = store.tasks().filter((kanban) => kanban.id !== task.id);
                patchState(store, { tasks: updatedTasks });
                const addTasks = [...store.tasks(), task];
                patchState(store, { tasks: addTasks });
              },
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    addTasks: rxMethod<IKanban>(
      pipe(
        switchMap((value) => {
          patchState(store, { isLoading: true });
          return kanbanService.create(value).pipe(
            tapResponse({
              next: (task) =>  patchState(store, { tasks : [...store.tasks(), value ]}),             
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),

    loadPriority: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return kanbanService.httpReadPriority().pipe(
            tapResponse({
              next: (priorities) => patchState(store, { priority: priorities }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadTasks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return kanbanService.getTasks().pipe(
            tapResponse({
              next: (tasks) => patchState(store, { tasks: tasks }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
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
    },
  })
);
