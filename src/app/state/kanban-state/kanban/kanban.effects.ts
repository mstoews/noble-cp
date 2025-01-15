import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';

import { KanbanAPIActions } from './kanban.actions';
import { KanbanService } from 'app/features/kanban/kanban.service';

@Injectable()
export class KanbanEffects {
  ngrxOnInitEffects() {
    return KanbanAPIActions.loadKanbans();
  }

  readonly kanbanService = inject(KanbanService);
  readonly actions$ = inject(Actions);
  readonly router = inject(Router);

  loadKanban$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanAPIActions.loadKanbans),
      exhaustMap(() => {
        return this.kanbanService.httpReadTasks().pipe(
          map((tasks) => KanbanAPIActions.kanbansLoadedSuccess({ tasks })),
          catchError((error) => of(KanbanAPIActions.kanbansLoadedFail({ message: error })))
        );        
      }))
  );


  /*
          tapResponse({
            next: (tasks) => patchState(state, { tasks: tasks }),
            error: console.error,
            finalize: () => patchState(state, { isLoading: false }),
          })
*/




  addKanban$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanAPIActions.kanbanAddedSuccess),
      concatMap(({ tasks }) =>
        this.kanbanService.create(tasks).pipe(
          map((newKanban) =>
            KanbanAPIActions.kanbanAddedSuccess({ tasks: newKanban })
          ),
          catchError((error) =>
            of(KanbanAPIActions.kanbanAddedFail({ message: error }))
          )
        )
      )
    )
  );

  updateKanban$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanAPIActions.updateKanban),
      concatMap(({ tasks }) =>
        this.kanbanService.update(tasks).pipe(
          map(() =>
            KanbanAPIActions.kanbanUpdatedSuccess({
              update: { id: tasks.id, changes: tasks },
            })
          ),
          catchError((error) =>
            of(KanbanAPIActions.kanbanUpdatedFail({ message: error }))
          )
        )
      )
    )
  );

  deleteKanban$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanAPIActions.deleteKanban),
      mergeMap(({ id }) =>
        this.kanbanService
          .delete(id)
          .pipe(map(() => KanbanAPIActions.kanbanDeletedSuccess({ id })))
      ),
      catchError((error) =>
        of(KanbanAPIActions.kanbanDeletedFail({ message: error }))
      )
    )
  );

  redirectToKanbanPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          KanbanAPIActions.kanbanAddedSuccess,
          KanbanAPIActions.kanbanUpdatedSuccess,
          KanbanAPIActions.kanbanDeletedSuccess
        ),
        tap(() => this.router.navigate(['/kanban']))
      ),
    { dispatch: false }
  );


}
