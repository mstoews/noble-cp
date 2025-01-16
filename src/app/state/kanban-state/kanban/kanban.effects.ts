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

import { KanbanAPIActions } from './actions/kanban.actions';
import { KanbanPageActions } from './actions/kanban-page.actions';
import { KanbanService } from 'app/features/kanban/kanban.service';

export class kanbanEffects {
  
  actions$ = inject(Actions);
  kanbanService = inject(KanbanService);

  loadKanban$ = createEffect(() =>
      this.actions$.pipe(
        ofType(KanbanPageActions.load),
        concatMap(() =>
            this.kanbanService.httpReadTasks().pipe(
            map((Kanban) =>
             KanbanAPIActions.loadKanbanSuccess({ Kanban })
            ),
            catchError((error) =>
              of(KanbanAPIActions.loadKanbanFailure({ error }))
            )
          )
        )
      )
    );
}



  // addKanban$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(KanbanPageActions.add),
  //     concatMap((tasks) =>
  //       this.kanbanService.create(tasks).pipe(
  //         map((newKanban) =>
  //           KanbanAPIActions.kanbanAddedSuccess({ Kanban: newKanban })
  //         ),
  //         catchError((error) =>
  //           of(KanbanAPIActions.kanbanAddedFail({ message: error }))
  //         )
  //       )
  //     )
  //   )
  // );

  // updateKanban$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(KanbanAPIActions.updateKanban),
  //     concatMap(({ tasks }) =>
  //       this.kanbanService.update(tasks).pipe(
  //         map(() =>
  //           KanbanAPIActions.kanbanUpdatedSuccess({
  //             update: { id: tasks.id, changes: tasks },
  //           })
  //         ),
  //         catchError((error) =>
  //           of(KanbanAPIActions.kanbanUpdatedFail({ message: error }))
  //         )
  //       )
  //     )
  //   )
  // );

  // deleteKanban$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(KanbanAPIActions.deleteKanban),
  //     mergeMap(({ id }) =>
  //       this.kanbanService
  //         .delete(id)
  //         .pipe(map(() => KanbanAPIActions.kanbanDeletedSuccess({ id })))
  //     ),
  //     catchError((error) =>
  //       of(KanbanAPIActions.kanbanDeletedFail({ message: error }))
  //     )
  //   )
  // );

  // redirectToKanbanPage = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(
  //         KanbanAPIActions.kanbanAddedSuccess,
  //         KanbanAPIActions.kanbanUpdatedSuccess,
  //         KanbanAPIActions.kanbanDeletedSuccess
  //       ),
  //       tap(() => this.router.navigate(['/kanban']))
  //     ),
  //   { dispatch: false }
  // );



