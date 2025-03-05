import { inject, Injectable } from '@angular/core';
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

  _loadProject$ = createEffect(() =>
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
  
_addProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(projectsPageActions.update),
      concatMap(({ project }) =>
        this.kanbanService.createProjects(project).pipe( map(() =>  
          projectsAPIActions.addedProjectsSuccess( { projects: project })),          
          catchError((error) =>
            of(projectsAPIActions.addedProjectsFail({ message: error }))
          )
        )
      )
    )
  );

_updateProject$ = createEffect(() =>
  this.actions$.pipe(
    ofType(projectsPageActions.update),
    mergeMap(({ project }) =>
      this.kanbanService.updateProjects(project).pipe( map(() =>  
        projectsAPIActions.updatedProjectsSuccess( { projects: project })),          
        catchError((error) =>
          of(projectsAPIActions.updatedProjectsFail({ message: error }))
        )
      )
    )
  )
);

_deleteProject$ = createEffect(() =>
  this.actions$.pipe(
    ofType(projectsPageActions.delete),
    concatMap(({ project }) =>
      this.kanbanService.deleteProjects(project).pipe( map(() =>  
        projectsAPIActions.deletedProjectsSuccess( { projects: project })),          
        catchError((error) =>
          of(projectsAPIActions.deletedProjectsFail({ message: error }))
        )
      )
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



