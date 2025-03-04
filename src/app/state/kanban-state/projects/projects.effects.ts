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

import { projectsAPIActions } from './actions/projects.actions';
import { projectsPageActions } from './actions/projects-page.actions';
import { KanbanService } from 'app/features/kanban/kanban.service';

export class projectEffects {

  actions$ = inject(Actions);
  kanbanService = inject(KanbanService);

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(projectsPageActions.load),
      concatMap(() =>
        this.kanbanService.readProjects().pipe(
          map((projects) =>
            projectsAPIActions.loadProjectsSuccess ({ projects })
          ),
          catchError((error) =>
            of(projectsAPIActions.loadProjectsFailure ({ error }))
          )
        )
      )
    )
  );
  addKanban$ = createEffect(() =>
  this.actions$.pipe(
    ofType(projectsPageActions.add),
    concatMap((tasks) =>
      this.kanbanService.create(tasks).pipe(
        map((newKanban) =>
          projectsAPIActions.addedProjectsSuccess ({ Kanban: newKanban })
        ),
        catchError((error) =>
          of(projectsAPIActions.updatedProjectsFail({ message: error }))
        )
      )
    )
  )
);

updateKanban$ = createEffect(() =>
  this.actions$.pipe(
    ofType(projectsAPIActions.updateKanban),
    concatMap(({ tasks }) =>
      this.kanbanService.update(tasks).pipe(
        map(() =>
          projectsAPIActions.addedProjectsSuccess({
            update: { id: tasks.id, changes: tasks },
          })
        ),
        catchError((error) =>
          of(projectsAPIActions.kanbanUpdatedFail({ message: error }))
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
        .pipe(map(() => projectsAPIActions.addedProjectsSuccess({ id })))
    ),
    catchError((error) =>
      of(projectsAPIActions.kanbanDeletedFail({ message: error }))
    )
  )
);
}





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



